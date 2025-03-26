<?php
#Grids API Controller
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\GridTracker\scanItem;
use App\Models\GridTracker\processItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use SKAgarwal\GoogleApi\PlacesApi;
use App\Jobs\ProcessItems;
use Illuminate\Support\Str;
use GoogleSearch;
class GridsApiController extends Controller
{
    /**
     * Create a new ListingsApiController instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function index()
    {
        // $res = ProcessItems::dispatch()->delay(now()->addSeconds(3));
    }

    public function fetchResults($scanId)
    {
        return response()->json([
            "status" => 200,
            "data" => processItem::where([
                ["scan_id", $scanId],
                ["status", "1"],
            ])->get(),
        ]);
    }

    #used to store a scan to DB
    public function store(Request $request)
    {
        $keyword = $request->post("keyword");
        $business = $request->post("business");
        $distance = $request->post("distance");
        $distance_type = $request->post("distance_type");
        $gridsize = $request->post("gridsize");
        $allgridPoints = $request->post("gridPoints");
        $searchType = $request->post("searchType");
        $autocompleteSearch = $request->post("autocompleteSearch");
        $autocompletePlaceId = $request->post("autocompletePlaceId");
        $autocompleteLat = $request->post("autocompleteLat");
        $autocompleteLng = $request->post("autocompleteLng");

        $gridPoints = json_encode($allgridPoints);
        try {
            $saveItem = new scanItem([
                "keyword" => $keyword,
                "business" => $business,
                "distance" => $distance,
                "distance_type" => $distance_type,
                "grid_size" => $gridsize,
                "grid_points" => $gridPoints,
                "search_type" => $searchType,
                "autocomplete_search" => $autocompleteSearch,
                "autocomplete_place_id" => $autocompletePlaceId,
                "autocomplete_lat" => $autocompleteLat,
                "autocomplete_lng" => $autocompleteLng,
            ]);
            $saveItem->save();
        } catch (\Exception $e) {
            return json_encode([
                "status" => $e->getMessage(),
            ]);
        }
        $scanId = $saveItem->id;
        foreach ($allgridPoints as $points) {
            try {
                $saveprocessItem = new processItem([
                    "process_id" => $scanId . "-" . uniqid(rand(), true),
                    "scan_id" => $scanId,
                    "lat" => $points[0],
                    "long" => $points[1],
                ]);
                $pointsArray[] = $points;
                $encPoints = json_encode($pointsArray);
                $saveprocessItem->save();
                // $updateStatus = scanItem::find($scanId);
                // $updateStatus->status = '1';
                // $updateStatus->update();

                $res = ProcessItems::dispatch(
                    $scanId,
                    $saveprocessItem->id
                )->delay(now()->addSeconds(3));
            } catch (\Exception $e) {
                return json_encode([
                    "status" => $e->getMessage(),
                ]);
            }
        }

        return json_encode([
            "status" => "200",
            "scanId" => $scanId,
            "data" => $encPoints,
        ]);
    }

    public function autoComplete(Request $request)
    {
        $keyword = $request->post("keyword");

        # set up the request parameters
        $queryString = http_build_query([
            "api_key" => env("VALUESERP_API_KEY"),
            "q" => $keyword,
            "search_type" => "places",
        ]);

        # make the http GET request
        $ch = curl_init(
            sprintf("%s?%s", "https://api.valueserp.com/search", $queryString)
        );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        # the following options are required if you're using an outdated OpenSSL version
        # more details: https://www.openssl.org/blog/blog/2021/09/13/LetsEncryptRootCertExpire/
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 180);

        $api_result = curl_exec($ch);
        curl_close($ch);

        # print the JSON response
        $data = json_decode($api_result);
        $suggestions = $data->places_results;

        return json_encode([
            "status" => "200",
            "suggestions" => $suggestions,
        ]);
    }

    public function searchPlace(Request $request)
    {
        $keyword = $request->post("keyword");
        $data_cid = $request->post("data_cid");

        $queryString = http_build_query([
            "api_key" => env("VALUESERP_API_KEY"),
            "search_type" => "place_details",
            "data_cid" => $data_cid,
        ]);

        # make the http GET request
        $ch = curl_init(
            sprintf("%s?%s", "https://api.valueserp.com/search", $queryString)
        );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        # the following options are required if you're using an outdated OpenSSL version
        # more details: https://www.openssl.org/blog/blog/2021/09/13/LetsEncryptRootCertExpire/
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 180);

        $api_result = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($api_result);

        return json_encode([
            "status" => "200",
            "data" => $data,
        ]);
    }

    public function get_scan($id)
    {
        $scan = \App\Models\GridTracker\scanItem::where("id", $id)
            ->get()
            ->first();

        return response()->json(["scan" => $scan]);
    }
}

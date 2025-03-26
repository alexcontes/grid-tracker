<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\GridTracker\scanItem;
use App\Models\GridTracker\processItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use SKAgarwal\GoogleApi\PlacesApi;
use GoogleSearch;
class ProcessItems implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $scanId;
    private $itemId;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 60;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($scanId, $itemId)
    {
        $this->scanId = $scanId;
        $this->itemId = $itemId;
        $this->onQueue("process_grid_tracker");
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        #We fetch 1 row from processItems table to get results from the google maps javascript API
        $items = processItem::where("scan_id", $this->scanId)
            ->where("id", $this->itemId)
            ->where("status", "=", 0)
            ->orderBy("id", "asc")
            ->get();

        foreach ($items as $item) {
            $scan = scanItem::where("id", "=", $item->scan_id)
                ->skip(0)
                ->take(1)
                ->get()
                ->first();

            $keyword = $scan->keyword;
            $business = $scan->business;
            $location = $item->lat . ", " . $item->long;
            $id = $item->id;
            // echo $keyword.$business.$location;
            $searchType = $scan->search_type;

            // var_dump("grid_use_which_api");
            // var_dump(@$settings->grid_use_which_api);

            if ($searchType == "sab") {
                // var_dump("Using value serp....");
                $queryString = http_build_query([
                    "api_key" => env("VALUESERP_API_KEY"),
                    "q" => $keyword,
                    "search_type" => "places",
                    "location" =>
                        "location=lat:" .
                        $item->lat .
                        ",lon:" .
                        $item->long .
                        ",zoom:15",
                ]);

                # make the http GET request
                $ch = curl_init(
                    sprintf(
                        "%s?%s",
                        "https://api.valueserp.com/search",
                        $queryString
                    )
                );
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 180);

                $api_result = curl_exec($ch);
                curl_close($ch);
                $data = json_decode($api_result);
                $results = $data->places_results;
                $businesses = array_column($results, "title");
                // $results = json_encode($businesses);
            } else {
                // var_dump("Using google maps....");
                // dd($google_maps_integration);
                #keyword, Location and API key will be dynamic as row we fetch from database.
                $googlePlaces = new PlacesApi(env("GOOGLE_MAPS_API_KEY"));
                $params = [
                    "keyword" => $keyword,
                    "location" => $location,
                ];
                $response = $googlePlaces->textSearch($keyword, $params);
                // $results = json_encode(array_column($response->all()['results']->all(), 'name'));

                $results = $response->all()["results"]->all();

                $businesses = array_column(
                    $response->all()["results"]->all(),
                    "name"
                );
            }

            if (in_array($business, $businesses)) {
                $rank = array_search($business, $businesses);
                processItem::where("id", $id)->update([
                    "results" => $results,
                    "rank" => $rank + 1,
                ]);
            } else {
                processItem::where("id", $id)->update([
                    "results" => $results,
                    "rank" => "0",
                ]);
            }

            // $results = json_encode(array_column($response->all()['results']->all(), 'name'));
            processItem::where("id", $id)->update([
                "results" => $results,
                "status" => "1",
            ]);
        }

        return $results;
    }
}

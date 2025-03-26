<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Places Search Box</title>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.4/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css">
      <link rel="stylesheet" href="css/style.css">
      <link rel="stylesheet" href="https://gridmybusiness.com/styles.261bc6b59e769e25a2ba.css">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style type="text/css">
         #search_type_wrapper {
         position: absolute;
         font-size: 12px;
         color: #757B89;
         padding-left: 20px;
         padding-top: 20px;
         }
      </style>
      <script src="js/script.js"></script>
   </head>
   <body>
      <div class="header-nav">
         <div id="search_type_wrapper">
            <label>
               <div style="float: left; padding-top: 2px;">
                  <input id="estRadio" type="radio" name="search_type" checked value="est" onclick="$('#togBtn2').prop('checked', true).trigger('click');" />
               </div>
               <div style="float: left; padding-left: 5px;">
                  Business
               </div>
            </label>
            <label id="service_radio_wrapper">
               <div style="float: left; padding-top: 2px;">
                  &nbsp;&nbsp;
                  <input id="sabRadio" type="radio" name="search_type" value="sab" onclick="$('#togBtn2').prop('checked', false).trigger('click');" />
               </div>
               <div style="float: left; padding-left: 5px;">
                  Service
               </div>
            </label>
         </div>
         <label class="switch2" style="display: none;">
            <input type="checkbox" id="togBtn2">
            <div class="slider2"></div>
         </label>
         <div class="auto_search_box">
            <input id="pac-input"  type="text" placeholder="Select Location"/>
         </div>
         <input id="sab_input"  type="text" onKeyUp="showResults(this.value)" placeholder="Select Location" autocomplete = 'off'/>
         <div id="result"style="display:none;"></div>
         <input id="pac-input2" type="text" placeholder="Insert Search query">
         <input id="businesslat" type = "hidden" />
         <input id="businesslng" type = "hidden" />
         <input id="businessplcid" type = "hidden" />
         <input id="hiddenScanId" type = "hidden"  value=""/>
         <input id="hiddenSkip" type = "hidden"  value=""/>
         <input id="hiddenSabBusinessName" type = "hidden"  value=""/>
         <label class="switch">
            <input type="checkbox" id="togBtn">
            <div class="slider"></div>
         </label>
         <select class="dropdown dropdown_position" name="gridsize" id="gridsize" onchange = "drawpoints();">
            <option value="3">3X3 grid</option>
            <option value="5">5X5 grid</option>
            <option value="7">7X7 grid</option>
            <option value="9">9X9 grid</option>
            <option value="11">11X11 grid</option>
            <option value="13">13X13 grid</option>
            <option value="15">15X15 grid</option>
         </select>
         <select class="dropdown dropdown_position2" name="distance" id="distance" onchange = "drawpoints();">
         </select>
         <input id = "draw_points" class="btn" value = "SCAN NOW" type = "submit" onclick="drawpoints(1);" style="background-color: #2477F6; padding: 11px 32px; border-radius: 5px;"/>
         <button id = "reset_button" type="button" class="btn link"style="background-color: #2477F6;" onclick="resetMap();"><i class="fa-solid fa-arrows-rotate"></i> Reset</button>
      </div>
      <div class="wrapper" style="position: relative;">
      </div>
      <div style="display:none;" class="justify-center bg-black bg-opacity-60 text-white rounded py-2 px-4 z-30 text-center ng-star-inserted popup_close">
         <span  class="mr-2 ng-star-inserted">Your scan has been completed.</span>&nbsp;<span  class="popup_close_btn opacity-30" onclick="hide()">Close</span>
      </div>
      <div style="display:none;" class="justify-center bg-black bg-opacity-60 text-white rounded py-2 px-4 z-30 text-center ng-star-inserted process_popup">
         <span  class="mr-2 ng-star-inserted">Your scan is in queue. Please wait as this may take some time or </span><span style="text-decoration:underline; cursor:pointer;"  class=" opacity-30" onclick="resetMap()">click here to start a new scan.</span>
      </div>
      <div class="export_report_div" style=" display:none; position: absolute;z-index: 3;right: 2%;top: 18%;">
         <button  class="flex items-center justify-center export_button btn" style="background: #FFFFFF;" onclick="exportPdf();"><i class="fa-solid fa-download"></i> <span class="export-text" style="font-size: 12px; padding-left: 5px;">EXPORT PDF</span></button>
      </div>
      <div class="export_csv_div" style=" display:none; position: absolute;z-index: 3;right: 2%;top: 25%;">
         <button  class="flex items-center justify-center export_button btn" style="background: #FFFFFF;" onclick="exportCsv();"><i class="fa-solid fa-file-excel"></i> <span class="export-text" style="font-size: 12px; padding-left: 5px;">EXPORT CSV</span></button>
      </div>
      <div id="cdk-overlay-4" class="cdk-overlay-pane ranking-items-dialog" style="max-width: 472px; max-height: calc(100vh - 144px); width: 100%; position: static; margin-top: 140px; margin-right: 1%; position: absolute; z-index: 999; top: 0px; right: 0px; display: none;">
         <div tabindex="0" class="cdk-visually-hidden cdk-focus-trap-anchor" aria-hidden="true"></div>
         <mat-dialog-container tabindex="-1" aria-modal="true" class="mat-dialog-container ng-tns-c44-6 ng-trigger ng-trigger-dialogContainer ng-star-inserted" id="mat-dialog-1" role="dialog" style="transform: none; overflow: auto; width: 100%;">
            <app-ranking-items-dialog _nghost-adk-c130="" class="ng-star-inserted">
               <div _ngcontent-adk-c130="">
                  <div _ngcontent-adk-c130="" class="bg-primary text-white py-4 px-6 sticky top-0 z-10" style="background: #19233A !important;">
                     <img _ngcontent-adk-c130="" src="assets/cross-white.png" alt="" class="absolute top-3 right-3 cursor-pointer" onclick="$('#cdk-overlay-4').hide();">
                     <p _ngcontent-adk-c130="" class="font-bold">Searched results for this location:</p>
                     <p _ngcontent-adk-c130="" class="f14 font-semibold"> Coordinates: <span id="results_lat"></span>, <span id="results_lng"></span> </p>
                     <div style="padding-top: 10px;">
                        <button id="generateSerpScreenshotBtn" class="flex items-center justify-center btn" style="background: #FFFFFF; color: #000000 !important;" onclick="generateSerpScreenshot();"><i class="fa-solid fa-image"></i> <span class="export-text" style="font-size: 12px; padding-left: 5px;">SERP Screenshot</span></button>
                     </div>
                  </div>
                  <div id="display_results_wrapper" _ngcontent-adk-c130="" style="height: 100%"></div>
               </div>
            </app-ranking-items-dialog>
            <!---->
         </mat-dialog-container>
         <div tabindex="0" class="cdk-visually-hidden cdk-focus-trap-anchor" aria-hidden="true"></div>
      </div>
      <div id="map" style="margin: auto;"></div>
      <div id="generating_pdf_wrapper" style="display: none; background: #2477F6; position: absolute; width: 100%; height: 100%; z-index:999; top: 0px; left: 0px; color: white; text-align: center; padding-top: 200px;">
         <i class="fa fa-spin fa-spinner"></i> Generating PDF Report... Please wait.
      </div>
      <div id="generating_screensht_wrapper" style="display: none; background: #2477F6; position: absolute; width: 100%; height: 100%; z-index:999; top: 0px; left: 0px; color: white; text-align: center; padding-top: 200px;">
         <i class="fa fa-spin fa-spinner"></i> Generating Screenshot... Please wait.
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"></script>
      <script type="text/javascript">
         var script = document.createElement('script');
         script.onload = function () {
             //do stuff with the script
         };
         script.src = "https://maps.googleapis.com/maps/api/js?key=<?php echo env("GOOGLE_MAPS_API_KEY");?>&callback=initAutocomplete&libraries=places&v=weekly";
         
         document.head.appendChild(script);
      </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script src="js/marker.js"></script>
      <script src="js/dms.js"></script>
      <script type="text/javascript">
         console.log(parent.window.RG_GRID_CONFIG);
      </script>
   </body>
</html>
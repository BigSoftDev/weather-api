
$(document).ready(function () {
    var citySelect = $("#city-select")[0];
    getOptionsFromJson("/resources/city.list.json", citySelect);
});
function getOptionsFromJson(jsonLocation, select){
    try {
        $.getJSON( jsonLocation, function( data ) {
            const cities = data;
            for (const city of cities)
            {
                if(city.state =="MD" & city.country=="US"){
                    var option = document.createElement("option");
                    option.value = city.id;
                    option.text = city.name +", "+ city.state;
                    select.appendChild(option);
                }
            }
        });
      } catch(err) {
        console.log(err)
        return
      }
}

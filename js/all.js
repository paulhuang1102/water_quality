var mouseX;
var mouseY;
var width = 800,
    height = 600;
var data = [];
$(document).ready(function() {
    getData();
    init();

});

var init = function() {
    var Cname = 'C_Name';
    var svg = d3.select(".wrap").append("svg")
        // .attr("class", "svgback")
        .attr("width", width)
        .attr("height", height);
    var projection = d3.geo.mercator()
        .center([121, 24])
        .scale(8000);

    if ($(window).width() <= 767) {
        projection = d3.geo.mercator().center([121.5, 24]).scale(7000);
    }

    if ($(window).width() <= 415) {
        projection = d3.geo.mercator().center([124, 23]).scale(5000);
    }

    var path = d3.geo.path()
        .projection(projection);

    d3.json("county.json", function(error, topology) {
        var g = svg.append("g");

        // 縣市/行政區界線
        d3.select("svg").append("path").datum(
            topojson.mesh(topology,
                topology.objects["County_MOI_1041215"],
                function(a,
                    b) {
                    return a !== b;
                })).attr("d", path).attr("class", "subunit-boundary");

        d3.select("g").selectAll("path")
            .data(topojson.feature(topology, topology.objects.County_MOI_1041215).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr({
                d: path,
                name: function(d) {
                    return d.properties["C_Name"];
                },
                fill: '#008800'
            });

        // 顯示滑鼠所指向的縣市/行政區
        d3.select("svg").selectAll("path").on("mouseenter", function() {
            // console.log(e);
            fill = $(this).attr("fill");
            $(this).attr("fill", '#000088');

            $('.title').html($(this).attr("name"));
            $('.panel').css({
                "height": "20px",
                "width": "60px",
                "position": "absolute"
            });
        }).on("mouseout", function() {
            $(this).attr("fill", fill);
        });
        // panel 隨滑鼠移動
        $("path").mouseover(function(e) {

            if ($('.panel').is(':visible')) {
                $('.panel').css({
                    'top': e.pageY,
                    'left': e.pageX
                });
            } else {
                $('.panel').fadeIn('slow');
            }
        });
        // $("path").mouseleave(function(e){
        //       $(".panel").fadeOut();
        // });
        var result = " ";
        
        var cboxresult = "<table><caption>查詢結果</caption><tr><td>地區</td><td>抽查時間</td><td>受檢驗機構</td><td>抽驗結果</td><td>檢驗項目</td><td>不合格項目</td><td>水源地</td></tr></table>";
        if ($(window).width() <= 415) {
            cboxresult = "<table><caption>查詢結果</caption><tr><td>地區</td><td>受檢驗機構</td><td>抽驗結果</td><td>檢驗項目</td><td>不合格項目</td><td>水源地</td></tr></table>"
            $("path").click(function() {
                for (i = 0; i < data.length; i++) {
                    if (data[i].County == $(this).attr("name")) {
                        result = result + "<table><tr><td>" + data[i].County + "</td><td>" + data[i].Org_Tested + "</td><td>" + data[i].Result + "</td><td>" + data[i].Items_Tested + "</td><td>" + data[i].Items_Failed + "</td><td>" + data[i].Location_Tested + "</td></tr></table>"
                    }
                }
                if (result === " ") {
                    result = "查無結果";
                }
                $.colorbox({
                    opacity: 0.85,
                    width: "90%",
                    html: cboxresult + result
                });

                result = " ";
            })
        } else {
            $("path").click(function() {
                var word = " ";
                for (i = 0; i < data.length; i++) {
                    word = word + data[i].County;
                    if (data[i]['County'] == $(this).attr("name")) {
                        result = result + "<table><tr><td>" + data[i]['County'] + "</td><td>" + data[i]['Test_Date'] + "</td><td>" + data[i]['Org_Tested'] + "</td><td>" + data[i]['Result'] + "</td><td>" + data[i]['Items_Tested'] + "</td><td>" + data[i]['Items_Failed'] + "</td><td>" + data[i]['Location_Tested'] + "</td></tr></table>"
                    }
                }
                if (result === " ") {
                    result = "查無結果";
                }
               
                $.colorbox({
                    opacity: 0.85,
                    width: "70%",
                    html: cboxresult + result
                });

                result = " ";
            })
        }
    });

}

var getData = function() {

    $.getJSON("water_test.json", function(json) {
            for (i = 0; i < json.length; i++) {
                data.push(json[i]);
            }

        })
        // $.ajax({
        //     type: 'GET',
        //     dataType: 'jsonp',
        //     url: 'http://opendata.epa.gov.tw/ws/Data/WAT00068/?$orderby=Test_Date&$skip=0&$top=1000&format=json',
        //     success: function(data) {
        //         var result = " ";
        //         var cboxresult = "<table><caption>查詢結果</caption><tr><td>地區</td><td>抽查時間</td><td>受檢驗機構</td><td>抽驗結果</td><td>檢驗項目</td><td>不合格項目</td><td>水源地</td></tr></table>";
        //         if ($(window).width() <= 415) {
        //             cboxresult = "<table><caption>查詢結果</caption><tr><td>地區</td><td>受檢驗機構</td><td>抽驗結果</td><td>檢驗項目</td><td>不合格項目</td><td>水源地</td></tr></table>"
        //             $("path").click(function() {
        //                 for (i = 0; i < data.length; i++) {
        //                     if (data[i].County == $(this).attr("name")) {
        //                         result = result + "<table><tr><td>" + data[i].County + "</td><td>" + data[i].Org_Tested + "</td><td>" + data[i].Result + "</td><td>" + data[i].Items_Tested + "</td><td>" + data[i].Items_Failed + "</td><td>" + data[i].Location_Tested + "</td></tr></table>"
        //                     }
        //                 }
        //                 if (result === " ") {
        //                     result = "查無結果";
        //                 }
        //                 $.colorbox({
        //                     opacity: 0.85,
        //                     width: "90%",
        //                     html: cboxresult + result
        //                 });

    //                 result = " ";
    //             })
    //         } else {
    //             $("path").click(function() {
    //                 for (i = 0; i < data.length; i++) {
    //                     if (data[i].County == $(this).attr("name")) {
    //                         result = result + "<table><tr><td>" + data[i].County + "</td><td>" + data[i].Test_Date + "</td><td>" + data[i].Org_Tested + "</td><td>" + data[i].Result + "</td><td>" + data[i].Items_Tested + "</td><td>" + data[i].Items_Failed + "</td><td>" + data[i].Location_Tested + "</td></tr></table>"
    //                     }
    //                 }
    //                 if (result === " ") {
    //                     result = "查無結果";
    //                 }

    //                 $.colorbox({
    //                     opacity: 0.85,
    //                     width: "70%",
    //                     html: cboxresult + result
    //                 });

    //                 result = " ";
    //             })
    //         }
    //     },
    //     error: function() {
    //         console.log('error!');
    //     }
    // })
}

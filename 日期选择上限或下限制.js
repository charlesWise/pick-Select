/**
 * Created by lianqin on 17/3/6.
 */

<div class="form-item item-line time-select" id="selectDate">
    <div class="pc-box" id="showDate">
        <span class="policy-te effect-time policy-jia" data-year="" data-month="" data-date="" id="selectBefore">{{orderCheckInfo.start_time}}</span>
        <span class="policy-te effect-time policy-jia" id="selectAfter"></span>
    </div>
</div>

//选择时间start
$scope.isSelectDate = false;//避免重复选择时间日期
$(document).on('click', '#selectDate', function(){
    // 初始化时间
    var showDateDom = $('#showDate');
    var now = new Date(), nowYear = now.getFullYear(), nowMonth = now.getMonth() + 1, nowDate = now.getDate(), selectYMDTime = '';
    var currentTime;
    currentTime = rootProductPolicy.eff_way_day == 2 ? now : new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if(rootProductPolicy.eff_way_day ==4){
        currentTime = new Date(now.getTime() + 24 * 60 * 60 * 1000 * rootProductPolicy.eff_way_day);
    }
    var lowBoundary = [currentTime.getFullYear(),currentTime.getMonth()+1,currentTime.getDate()];
    var upBoundary = [currentTime.getFullYear()+1,currentTime.getMonth()+1,currentTime.getDate()-1];
    showDateDom.attr('data-year', nowYear);
    showDateDom.attr('data-month', nowMonth);
    showDateDom.attr('data-date', nowDate);

    // 数据初始化
    function formatYear (nowYear) {
        var arr = [];
        for (var i = lowBoundary[0]; i <= upBoundary[0]; i++) {
            arr.push({
                id: i + '',
                value: i + '年'
            });
        }
        return arr;
    }
    function formatMonth (year) {
        var arr = [];
        var start = 1,end = 12;
        if(year==lowBoundary[0]){
            start = lowBoundary[1];
        }
        if(year == upBoundary[0]){
            end = upBoundary[1];
        }
        for (var i = start; i <= end; i++) {
            arr.push({
                id: i + '',
                value: i + '月'
            });
        }
        return arr;
    }
    function formatDate (year,month,count) {
        var arr = [];
        var start = 1,end = count;
        if(year == lowBoundary[0]&&month==lowBoundary[1]){
            start = lowBoundary[2];
        }
        if(year == upBoundary[0]&&month==upBoundary[1]){
            end = upBoundary[2];
        }
        for (var i = start; i <= end; i++) {
            arr.push({
                id: i + '',
                value: i + '日'
            });
        }
        return arr;
    }
    var yearData = function(callback) {
        callback(formatYear(nowYear));
    }
    var monthData = function (year, callback) {
        callback(formatMonth(year));
    };
    var dateData = function (year, month, callback) {
        if (/^1|3|5|7|8|10|12$/.test(month)) {
            callback(formatDate(year,month,31));
        }
        else if (/^4|6|9|11$/.test(month)) {
            callback(formatDate(year,month,30));
        }
        else if (/^2$/.test(month)) {
            if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                callback(formatDate(year,month,29));
            }
            else {
                callback(formatDate(year,month,28));
            }
        }
        else {
            throw new Error('month is illegal');
        }
    };
    if ($scope.isSelectDate) return;
    $scope.isSelectDate = true;

    var oneLevelId = showDateDom.attr('data-year');
    var twoLevelId = showDateDom.attr('data-month');
    var threeLevelId = showDateDom.attr('data-date');
    new IosSelect(3,
        [yearData, monthData, dateData],
        {
            container: '.policyContainer',
            title: '',
            leftTitle: '取消',
            rightTitle: '确定',
            itemHeight: 35,
            relation: [1, 1],
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            showLoading: true,
            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                $('#showDate').attr('data-year', selectOneObj.id);
                $('#showDate').attr('data-month', selectTwoObj.id);
                $('#showDate').attr('data-date', selectThreeObj.id);
                $('#selectBefore').css({'display': 'none'});
                $('#selectAfter').html(selectOneObj.id + '-' + selectTwoObj.id + '-' + selectThreeObj.id);
                selectYMDTime = new Date(selectOneObj.id, selectTwoObj.id, selectThreeObj.id);
                console.log(selectYMDTime);
                selectYMDTime = $util.formatSelectDate(selectYMDTime,'-');
                console.log(selectYMDTime);
                $scope.$apply(function() {
                    $scope.productPolicyInfo.selectYMDTime = selectYMDTime;
                });
                $localStorage.set('selectYMDTime', selectYMDTime)
                $scope.isSelectDate = false;
            },
            cb: function (){
                $scope.isSelectDate = false;
            }
        });
    $('.olay').slice(1).remove();
});
// 选择时间end
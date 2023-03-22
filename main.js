var weeksLeft;
var yearOfBirth;
var ageExpectancy=80;

var totalWeeksInLife=ageExpectancy*52.1429;
var birthdayDate;

$('document').ready(function() {
    $('#onclick_setDate').click(setDate);
    calculateEverything();
});

function setDate() {
    localStorage.bdayInput = $('#bdayInput').val();
    localStorage.nameInput = $('#nameInput').val();
    $('#ageInput').hide();
    calculateEverything();
}

function calculateEverything() {
    if(localStorage.bdayInput) {
        weeksLeft=returnWeeks(localStorage.bdayInput);

        if(localStorage.nameInput) prependString=localStorage.nameInput+", only ";
        else prependString="Only "

        $('#weeksLeft').html(prependString+weeksLeft+" Sundays remain");
        $('#ageInput').hide();

        plotLifeChart();
    } else {
        $('#weeksLeft').html("Please tell us your name and when you were born");
        $('#ageInput').show();
    }

    $('#bdayInput').val(localStorage.bdayInput);
    $('#nameInput').val(localStorage.nameInput);
}

//birthday is of type YYYYMMDD like 19870603
function returnWeeks(birthday) {
    //assume life expectancy to be 80 years
    bday = new Date(birthday);
    var ageDifMs = Date.now() - bday.getTime();
    yearOfBirth=bday.getFullYear();
    birthdayDate=bday;
    return Math.ceil(totalWeeksInLife - ageDifMs/(1000*60*60*24*7));
}

function plotLifeChart() {
    curYear=yearOfBirth;
    weeksInCurYear = weeksInYear(curYear);

    curWeek = 1;
    curWeekOfYear=1;

    firstDateofBirth=new Date(yearOfBirth,0,1);
    weeksUntilStart = Math.round(days_between(birthdayDate, firstDateofBirth)/7);

    today = new Date();
    [this_year, this_week] = getWeekNumber(today);

    $('#mainpanegraphic').html("");

    for(var row=0; row<4; row++) {
        $('#mainpanegraphic').append("<div id='graphic_row_"+row+"' class='decadeBlock'></div>");

        for(var column=0;column<20; column++) {
            $('#graphic_row_'+row).append('<span id="graphic_year_'+row+'_'+column+'" class="yearBlock"><small>'+curYear+'</small><br/><span>');

            curWeekOfYear=1;

            for (var i = 0; i <13; i++) {
                $('#graphic_year_'+row+'_'+column).append("<span id='graphic_year_"+row+"_"+column+"_"+i+"' class='monthBlock'></span><br/>");

                for(var j=0; j<4; j++) {
                    if(curWeekOfYear>weeksInCurYear) break;

                    if(curWeek<weeksUntilStart) weekBlock = 'weekBlockNotBorn';
                    else {
                        if(curYear<this_year) weekBlock = 'weekBlockSpent';
                        else if (curYear==this_year) { 
                            if(curWeekOfYear <= this_week) weekBlock='weekBlockSpent';
                            else weekBlock='weekBlockLeft';
                        } else weekBlock='weekBlockLeft';
                    }

                    $('#graphic_year_'+row+'_'+column+'_'+i).append("<span class='"+weekBlock+"'></span>");

                    curWeek++;
                    curWeekOfYear++;
                }
            }; 
            
            curYear++;
            weeksInCurYear = weeksInYear(curYear);
        }
    }
}

function weeksInYear(year) {
    var month = 11, day = 31, week;

    // Find week that 31 Dec is in. If is first week, reduce date until
    // get previous week.
    do {
        d = new Date(year, month, day--);
        week = getWeekNumber(d)[1];
    } while (week == 1);

    return week;
}

function days_between(date1, date2) {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}
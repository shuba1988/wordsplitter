/// <reference path="jquery-3.1.1.js" />
/// <reference path="jquery-3.1.1.intellisense.js" />
/// <reference path="clipboard.min.js" />

//Load
var charCount = "";
var charCountInSelectedText = "";

$('#helpInformation').hide();

$('#lblHelp').mouseover(function () {
    $('#lblHelp').css("cursor", "help");
    $('#helpInformation').show();
}).mouseleave(function () {
    $('#helpInformation').hide();
});

document.getElementById('txtText').style.fontFamily = "alk-rounded-nusx-med-webfont";
document.getElementById('txtResult').style.fontFamily = "alk-rounded-nusx-med-webfont";
document.getElementById('getDate').innerHTML = new Date().getFullYear(); //GetDate
document.getElementById('btnCopy').style.display = 'none';
var clipboard = new Clipboard('#btnCopy');

function Split() {
    var text = document.getElementById("txtText").value; //.toLowerCase()

    if (text.length < 1) {
        document.getElementById("lblCharCount").innerHTML = '';
        charCount = 0;
        return;
    }
    var SpaceIndexs = [0]; //ხმოვნების მასივი 
    var VowelIndexs = []; //ხმოვნების მასივი 
    var DashIndexs = []; //ტირეების მასივი
    //ზმნისწინები
    var VerbFronts = ["მი", "მო", "და", "ჩა", "შე", "გა", "წა", "ამო", "აღ", "გან", "შთა", "წარ", "მიმო", "ჩამო", "შემო", "გადა", "გადმო", "გარდა", "უკუნ", "წიაღ", "დამო", "აღმო", "გამო", "წარმო", "გარდამო", "შთამო", "უკუმო", "წიაღმო", "mi", "mo", "da", "Ca", "Se", "ga", "wa", "amo", "aR", "gan", "STa", "war", "mimo", "Camo", "Semo", "gada", "gadmo", "garda", "ukun", "wiaR", "damo", "aRmo", "gamo", "warmo", "gardamo", "STamo", "ukumo", "wiaRmo", "MI", "MO", "DA", "CA", "SE", "GA", "WA", "AMO", "AR", "GAN", "STA", "WAR", "MIMO", "CAMO", "SEMO", "GADA", "GADMO", "GARDA", "UKUN", "WIAR", "DAMO", "ARMO", "GAMO", "WARMO", "GARDAMO", "STAMO", "UKUMO", "WIARMO"];
    //თანდებულები
    var Prepositions = ["ვით", "თან", "ზე", "ში", "შუა", "გან", "კენ", "თვის", "ებრ", "ურთ", "დან", "მდე", "მდის", "შორის", "თანავე", "გამო", "გარდა", "მიერ", "viT", "Tan", "ze", "Si", "Sua", "gan", "ken", "Tvis", "ebr", "urT", "dan", "mde", "mdis", "Soris", "Tanave", "gamo", "garda", "mier", "VIT", "TAN", "ZE", "SI", "SUA", "GAN", "KEN", "TVIS", "EBR", "URT", "DAN", "MDE", "MDIS", "SORIS", "TANAVE", "GAMO", "GARDA", "MIER"];
    //ხმოვნის ინდექსები
    for (var i = 0; i < text.length; i++) {
        if (IsVowel(text[i])) { VowelIndexs.push(i); }
        if (text[i] === " ") { SpaceIndexs.push(i); }
    }
    // ზმნისწინებისა და თანდებულის ინდექსების პოვნა. 2-დან 5-მდე თანდებულების მასივში თანდებულის ინდექსის პოვნა, რადგან მაქსიმალური სიგრძე ზმნისწინის ან თანდებულის არის 6
    for (var i = 0; i < SpaceIndexs.length; i++) { //პრაბელების დაგენერირებით წამოვა თითოეული სიტყვა
        var correctedText = text.substring(SpaceIndexs[i], SpaceIndexs[i + 1]); //თითოეული სიტყვა
        var simpleText = correctedText;
        var _removedIndexCount = 0;
        if (HasLastIndexSymbol(correctedText)) {
            simpleText = correctedText.slice(0, -1);
            //_removedIndexCount++;
        }
        var _simpleText = simpleText;
        //როდესაც ზედიზედ არის ორი გამოტოვება, ამ შემთხვევაშუ არასწორ ინდექსს სვავს, რადგან _removedIndexCount-ი 2-ით არ იზდება
        if (HasFirstIndexSymbol(_simpleText)) {
            _simpleText = _simpleText.substr(1);
            _removedIndexCount++;
        }
        for (var j = 2; j < 9; j++) { // ამ ციკლით ზმნისწინებში და თანდებულებში ეძებს შესაბამისი ელემენტების ინდექსებს
            if (simpleText.length >= j) { // თუ სიტყვა simpleText-ის სიგრძე არ აღემატება ზმნისწინის მიმდინარე სიგრძეს
                if (VerbFronts.indexOf(simpleText.slice(0, j)) != -1) { // თუ იპოვა ზმნისწინი
                    var firstCycleIndex = i === 0 ? 0 : 1;
                    if (SpaceIndexs[i] + j + firstCycleIndex != SpaceIndexs[i + 1]) { // თუ ზმნისწის შემდგომ გამოტოვება არ არის, მაშინ
                        var afterVerbWord = simpleText.slice(j, simpleText.length); // ზმნისწინის შემდგომი ტექსტი
                        if (afterVerbWord.length > 0 && IsVowel(afterVerbWord[0])) { // მეტია 0-ზე და არის ხმოვანი
                            DashIndexs.push(SpaceIndexs[i] + j + firstCycleIndex + _removedIndexCount); //ტირეების მასივში ჩაამატებს შესაბამის ზმნისწინის ტირეს ინდექსს ;)
                        }
                    }
                }
                var a = simpleText.slice(simpleText.length - j, simpleText.length);
                if (Prepositions.indexOf(simpleText.slice(simpleText.length - j, simpleText.length)) != -1) { // თუ იპოვა თანდებული

                    var firstCycleIndex = i === 0 ? simpleText.length - j : SpaceIndexs[i] + (simpleText.length - j - 1);

                    if (firstCycleIndex !== 0 && firstCycleIndex !== SpaceIndexs[i] + 1) {
                        DashIndexs.push(firstCycleIndex + _removedIndexCount);
                    }
                }
            }
            else {
                break;
            }
        }
    }
    //როდესაც ზმნისწინები და თანდებულები დაგენერირდება, შემდგომ უნდა მოხდეს ტირეებს შორის არსებული ტექსტებზე გადარბენა
    if (DashIndexs.length > 1) { //თუ ზმნისწინი ან თანდებული იპოვა
        var _dashIndex = [];
        var _dashAndSpaceIndexs = [];
        _dashAndSpaceIndexs = _dashAndSpaceIndexs.concat(DashIndexs);
        _dashAndSpaceIndexs = _dashAndSpaceIndexs.concat(SpaceIndexs);
        _dashAndSpaceIndexs.sort(function (a, b) { return a - b });
        for (var i = 0; i < _dashAndSpaceIndexs.length; i++) {
            var correctedText = text.substring(_dashAndSpaceIndexs[i], _dashAndSpaceIndexs[i + 1]);// იღებს ტექსტს ინდექსებს შორის
            var simpleText = correctedText;
            var _removedIndexCount = 0;

            var _tempText = simpleText;
            while (HasLastIndexSymbol(_tempText)) {
                _tempText = _tempText.slice(0, -1);
            }
            while (HasFirstIndexSymbol(_tempText)) {
                _tempText = _tempText.slice(1, _tempText.length);
                _removedIndexCount++;
            }
            simpleText = _tempText;

            var numberOfLineBreaks = (simpleText.match(/\n/g) || []).length;
            if (IsWord(simpleText, numberOfLineBreaks)) {
                var _vowelIndexs = [];
                for (var j = 0; j < simpleText.length; j++) {
                    var x = simpleText[j];
                    if (IsVowel(simpleText[j])) {
                        _vowelIndexs.push(j);
                    }
                }
                if (_vowelIndexs.length > 1) {
                    for (var k = 0; k < _vowelIndexs.length - 1; k++) {
                        switch (_vowelIndexs[k + 1] - _vowelIndexs[k]) {
                            case 1: //ხმოვანი-ხმოვანი
                                _dashIndex.push(_dashAndSpaceIndexs[i] + _vowelIndexs[k] + 1 + _removedIndexCount);
                                break;
                            case 2: //ხმოვანი-თანხმოვანი ხმოვანი
                                _dashIndex.push(_dashAndSpaceIndexs[i] + _vowelIndexs[k] + 1 + _removedIndexCount);
                                break;
                            case 3: //ხმოვანი თანხმოვანი-თანხმოვანი ხმოვანი
                                _dashIndex.push(_dashAndSpaceIndexs[i] + _vowelIndexs[k] + 2 + _removedIndexCount);
                                break;
                            case 4: //ხმოვანი თანხმოვანი-თანხმოვანი თანხმოვანი ხმოვანი
                                _dashIndex.push(_dashAndSpaceIndexs[i] + _vowelIndexs[k] + 2 + _removedIndexCount);
                                break;
                            case 5: //ხმოვანი თანხმოვანი-თანხმოვანი თანხმოვანი ხმოვანი
                                _dashIndex.push(_dashAndSpaceIndexs[i] + _vowelIndexs[k] + 2 + _removedIndexCount);
                                break;
                            case 6: //ხმოვანი თანხმოვანი-თანხმოვანი თანხმოვანი ხმოვანი
                                _dashIndex.push(_dashAndSpaceIndexs[i] + _vowelIndexs[k] + 2 + _removedIndexCount);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        DashIndexs = DashIndexs.concat(_dashIndex);
    }
    else {
        //გენერირდება ტირეების ინდექსები
        for (var i = 0; i < VowelIndexs.length - 1; i++) {
            var simpleText = text.substring(VowelIndexs[i], VowelIndexs[i + 1]); //იღებს ტექსტს ინდექსებს შორის
            var numberOfLineBreaks = (simpleText.match(/\n/g) || []).length; //პრაბელების რაოდენობა
            if (IsWord(simpleText, numberOfLineBreaks)) {
                switch (VowelIndexs[i + 1] - VowelIndexs[i]) {
                    case 1: //ხმოვანი-ხმოვანი
                        DashIndexs.push(VowelIndexs[i] + 1);
                        break;
                    case 2: //ხმოვანი-თანხმოვანი ხმოვანი
                        DashIndexs.push(VowelIndexs[i] + 1);
                        break;
                    case 3: //ხმოვანი თანხმოვანი-თანხმოვანი ხმოვანი
                        DashIndexs.push(VowelIndexs[i] + 2);
                        break;
                    case 4: //ხმოვანი თანხმოვანი-თანხმოვანი თანხმოვანი ხმოვანი
                        DashIndexs.push(VowelIndexs[i] + 2);
                        break;
                    case 5: //ხმოვანი თანხმოვანი-თანხმოვანი თანხმოვანი ხმოვანი
                        DashIndexs.push(VowelIndexs[i] + 2);
                        break;
                    case 6: //ხმოვანი თანხმოვანი-თანხმოვანი თანხმოვანი ხმოვანი
                        DashIndexs.push(VowelIndexs[i] + 2);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    DashIndexs.sort(function (a, b) { return a - b });
    function removeDuplicates(arr) {
        var copy = arr.slice(0);
        arr.length = 0;
        for (var i = 0, len = copy.length; i < len; ++i) {
            if (i == 0 || copy[i] != copy[i - 1]) {
                arr.push(copy[i]);
            }
        }
        return arr;
    }
    removeDuplicates(DashIndexs);
    //ტექსტში ჩასმა ინდექსები
    for (var i = DashIndexs.length - 1; i >= 0; i--) {
        var simple = text.slice(0, DashIndexs[i]);
        simple = simple + "-";
        simple = simple + text.slice(DashIndexs[i], text.length);
        text = simple;
    }
    document.getElementById("txtResult").value = text;
    document.getElementById("lblCharCount").innerHTML = VowelIndexs.length;
    charCount = VowelIndexs.length;
    document.getElementById("btnSplit").style.display = 'none';
    document.getElementById("btnCopy").style.display = 'inline-block';
    $('#convertInfo').removeClass('hidden');
}
function UnSplit() {
    var text = document.getElementById("txtResult").value;
    if (text.length < 1) {
        document.getElementById("lblCharCount").innerHTML = '';
        charCount = 0;
        return;
    }
    for (var i = 0; i < text.length; i++) {
        if (text[i] == "-") {
            var simple = text.slice(0, i);
            simple = simple + text.slice(i + 1, text.length);
            text = simple;
        }
    }
    document.getElementById("txtResult").value = text;
}
function IsWord(simpleText, numberOfLineBreaks) {
    if (simpleText.indexOf(" ") < 1
        && numberOfLineBreaks < 1
        && simpleText.indexOf(".") < 1
        && simpleText.indexOf("-") < 1
        && simpleText.indexOf(",") < 1
        && simpleText.indexOf(":") < 1
        && simpleText.indexOf("?") < 1
        && simpleText.indexOf("!") < 1) {
        return true;
    }
    else {
        return false;
    }
}
function IsVowel(item) {
    if (item.toLowerCase() == "a"
        || item.toLowerCase() == "A"
        || item.toLowerCase() == "e"
        || item.toLowerCase() == "E"
        || item.toLowerCase() == "i"
        || item.toLowerCase() == "I"
        || item.toLowerCase() == "o"
        || item.toLowerCase() == "O"
        || item.toLowerCase() == "u"
        || item.toLowerCase() == "U"
        || item.toLowerCase() == "ა"
        || item.toLowerCase() == "ე"
        || item.toLowerCase() == "ი"
        || item.toLowerCase() == "ო"
        || item.toLowerCase() == "უ") {
        return true;
    }
    else {
        return false
    }
}
function Clear() {
    document.getElementById("txtText").value = "";
    document.getElementById("txtResult").value = "";
    document.getElementById("lblCharCount").innerHTML = "";
    charCount = 0;
    document.getElementById("SelectedVowelCount").innerHTML = "";
    charCountInSelectedText = 0;
    document.getElementById("btnSplit").style.display = 'inline-block';
    document.getElementById('btnCopy').style.display = 'none';
    $('#convertInfo').addClass('hidden');
}
function ResetSelectedTextCount() {
    document.getElementById("SelectedVowelCount").innerText = "";
    charCountInSelectedText = 0;
}
function SelectedVowelCount() {
    document.getElementById("SelectedVowelCount").innerHTML = '';
    var txtarea = document.getElementById("txtText");
    var start = txtarea.selectionStart;
    var finish = txtarea.selectionEnd;
    var selectedText = txtarea.value.substring(start, finish);

    //ხმოვნის ინდექსები
    var result = 0;
    for (var i = 0; i < selectedText.length; i++) {
        if (IsVowel(selectedText[i])) {
            result += 1; // ხმოვნების რაოდენობა
        }
    }
    document.getElementById("SelectedVowelCount").innerHTML = result;
    charCountInSelectedText = result;
}
function SplitWithEnterKey(e) {
    if (e.keyCode == 13) {
        Split();
        document.getElementById("btnSplit").style.display = 'none';
        document.getElementById("btnCopy").style.display = 'inline-block';
    }
}
function GetResultByType(key) {
    Split();
    var resultText = document.getElementById("txtResult").value;
    var result = "";

    //ორმაგი სიტყვების მასივი გნაკუთვლინია მაღალი და დაბალი ასოების ინდექსების საძებნად
    var bearsInglishForGeo = ["a", "b", "g", "d", "e", "v", "z", "T", "i", "k", "l", "m", "n", "o", "p", "J", "r", "s", "t", "u", "f", "q", "R", "y", "S", "C", "c", "Z", "w", "W", "x", "j", "h", "A", "B", "G", "D", "E", "V", "Z", "T", "I", "K", "L", "M", "N", "O", "P", "J", "R", "S", "T", "U", "F", "Q", "R", "Y", "S", "C", "C", "Z", "W", "W", "X", "J", "H"];
    var bearsGeorgianForGeo = ["ა", "ბ", "გ", "დ", "ე", "ვ", "ზ", "თ", "ი", "კ", "ლ", "მ", "ნ", "ო", "პ", "ჟ", "რ", "ს", "ტ", "უ", "ფ", "ქ", "ღ", "ყ", "შ", "ჩ", "ც", "ძ", "წ", "ჭ", "ხ", "ჯ", "ჰ", "ა", "ბ", "გ", "დ", "ე", "ვ", "ზ", "თ", "ი", "კ", "ლ", "მ", "ნ", "ო", "პ", "ჟ", "რ", "ს", "ტ", "უ", "ფ", "ქ", "ღ", "ყ", "შ", "ჩ", "ც", "ძ", "წ", "ჭ", "ხ", "ჯ", "ჰ"];
    //var bearsInglishForEng = ["a", "b", "g", "d", "e", "v", "z", "t", "i", "k", "l", "m", "n", "o", "p'", "zh", "r", "s", "t'", "u", "p", "k", "gh", "q'", "sh", "ch", "ts", "dz", "ts'", "ch'", "kh", "j", "h", "A", "B", "G", "D", "E", "V", "Z", "T", "I", "K", "L", "M", "N", "O", "P'", "ZH", "R", "S", "T'", "U", "P", "K", "GH", "Q", "SH", "CH", "TS", "DZ", "TS'", "CH'", "KH", "J", "H"];
    var bearsInglishForEng = ["a", "b", "g", "d", "e", "v", "z", "t", "i", "k'", "l", "m", "n", "o", "p'", "zh", "r", "s", "t'", "u", "p", "k", "gh", "q", "sh", "ch", "ts", "dz", "ts'", "ch'", "kh", "j", "h", "A", "B", "G", "D", "E", "V", "Z", "T", "I", "K'", "L", "M", "N", "O", "P'", "ZH", "R", "S", "T'", "U", "P", "K", "GH", "Q", "SH", "CH", "TS'", "DZ", "TS'", "CH'", "KH", "J", "H"];

    switch (key) {
        case "toEn":
            for (var i = 0; i < resultText.length; i++) {
                if (resultText[i] != "-" && resultText[i] != " ") {
                    var index = bearsGeorgianForGeo.indexOf(resultText[i]) === -1 ? bearsInglishForGeo.indexOf(resultText[i]) : bearsGeorgianForGeo.indexOf(resultText[i]);
                    //თუ index = -1 => ე.ი. დაფიქსირდა უცნობი სიმბოლო, რომლსაც გვერდს აუვლის

                    if (i == 0 && index !== -1) {
                        result = bearsInglishForGeo[index] + resultText.slice(1, resultText.length);
                        resultText = result;
                    }
                    else if (index !== -1) {
                        result = resultText.slice(0, i) + bearsInglishForGeo[index] + resultText.slice(i + 1, resultText.length);
                        resultText = result;
                    }
                }
            }
            document.getElementById("txtResult").value = result;
            return;
        case "toGe":
            for (var i = 0; i < resultText.length; i++) {
                if (resultText[i] != "-" && resultText[i] != " ") {
                    var index = bearsGeorgianForGeo.indexOf(resultText[i]) === -1 ? bearsInglishForGeo.indexOf(resultText[i]) : bearsGeorgianForGeo.indexOf(resultText[i]);

                    if (i == 0 && index !== -1) {
                        result = bearsGeorgianForGeo[index] + resultText.slice(1, resultText.length);
                        resultText = result;
                    }
                    else if (index !== -1) {
                        result = resultText.slice(0, i) + bearsGeorgianForGeo[index] + resultText.slice(i + 1, resultText.length);
                        resultText = result;
                    }
                }
            }
            document.getElementById("txtResult").value = result;
            return;
        case "toFullEnglish":
            for (var i = 0; i < resultText.length; i++) {
                if (resultText[i] != "-" && resultText[i] != " ") {
                    var index = bearsGeorgianForGeo.indexOf(resultText[i]) === -1 ? bearsInglishForGeo.indexOf(resultText[i]) : bearsGeorgianForGeo.indexOf(resultText[i]);

                    if (i == 0 && index !== -1) {
                        result = bearsInglishForEng[index] + resultText.slice(1, resultText.length);
                        resultText = result;
                    }
                    else if (index !== -1) {
                        result = resultText.slice(0, i) + bearsInglishForEng[index] + resultText.slice(i + 1, resultText.length);
                        resultText = result;
                    }
                }
            }
            document.getElementById("txtResult").value = result;
            return;
        default:
            return result;
    }
}
function HasLastIndexSymbol(text) {
    if (text.lastIndexOf(',') > 0
     || text.lastIndexOf('.') > 0
     || text.lastIndexOf(' ') > 0
     || text.lastIndexOf('-') > 0
     || text.lastIndexOf(',') > 0
     || text.lastIndexOf(':') > 0
     || text.lastIndexOf('?') > 0
     || text.lastIndexOf('!') > 0) {
        return true;
    }
    else {
        return false;
    }
}
function HasFirstIndexSymbol(text) {
    if (text[0] === ','
     || text[0] === '.'
     || text[0] === '\n'
     || text[0] === ' '
     || text[0] === '-'
     || text[0] === ','
     || text[0] === ':'
     || text[0] === '?'
     || text[0] === '!') {
        return true;
    }
    else {
        return false;
    }
}
function ChangeCurrentLanguage(culture) {
    if (culture === 'en') {
        document.getElementById('title').innerHTML = "Word Hyphenator";
        /* BUTTONS */
        document.getElementById('btnCopy').innerHTML = "<span class='glyphicon glyphicon-copy'></span> COPY";
        document.getElementById('btnSplit').innerHTML = "<span class='glyphicon glyphicon-ok'></span> SPLIT";
        document.getElementById('btnClear').innerHTML = "<span class='glyphicon glyphicon-remove'></span> CLEAR";
        document.getElementById('btnUndo').innerHTML = "<span class='glyphicon glyphicon-share-alt rotateHorizontal'></span> UNSPLIT";

        document.getElementById('convertTo').innerHTML = "Convert To:";
        document.getElementById('convertToGeorgia').innerHTML = "GEORGIAN";
        document.getElementById('convertToEnglish').innerHTML = "LATIN <small>(Recomended for Finale)</small>";
        document.getElementById('convertToEnglishTrascript').innerHTML = "LATIN <small>(with transcription)</small>";

        /* HELP BUTTON */
        document.getElementById('btnHelp').innerHTML = "<span class='glyphicon glyphicon-cog'></span> HELP";
        document.getElementById('helpTitle').innerHTML = "<b>Help</b>";
        var helptext = '<p>The Word Hyphenator is a free online be lingual (Georgian-English) program that automatically hyphenates Georgian words into syllables.</p>' +
                       '<p>It is compatible with music notation software (like <a href="http://www.finalemusic.com/" target="_blank">Finale</a>). It is also a great tool for foreigners for learning Georgian language.' +
                           'The program has the function of transliteration (Georgian-Latin scripts).' +
                       '</p>' +
                       '<p>' +
                           '<b>Current limitations include:</b><br />' +
                           'The program hyphenates solely according to the rules of syllabification of the Georgian language (As well in English version).' +
                           'Transliterates only from Georgian into Latin (not on the contrary).' +
                           'While transliterating the text into the Latin alphabet, the program does not capitalize first letters of the sentences.' +
                       '</p>' +
                       '<p>Write Use Your Notes: <b class="btnFont">wordhyphenator@gmail.com</b></p>';
        document.getElementById('helpContent').innerHTML = helptext;

        /* TEXBOXES */
        document.getElementById('txtText').placeholder = "Enter the text...";
        document.getElementById('txtResult').placeholder = "See the result...";

        /* RESULT NOTIFICATIONS */
        document.getElementById('countOfGrains').innerHTML = "The number of syllables: <span id='lblCharCount' class='customColor'>" + charCount + "</span>";
        document.getElementById('countOfGrainsInSelectedText').innerHTML = "The number of syllables in selected text: <span id='SelectedVowelCount' class='customColor'>" + charCountInSelectedText + "</span>";

        /* FOOTER */
        document.getElementById('footer').innerHTML = "ALL RIGHTS RESERVED &copy; <span id='lblAuthor'>AUTHOR: GIGA SHUBITIDZE</span> 2016 - <span id='getDate'>" + new Date().getFullYear() + "</span> YEAR <span class='pull-right'>VERSION 1.0.0</span>";
    }
    else {
        document.getElementById('title').innerHTML = "დამმარცვლელი";
        /* BUTTONS */
        document.getElementById('btnCopy').innerHTML = "<span class='glyphicon glyphicon-copy'></span> დააკოპირე";
        document.getElementById('btnSplit').innerHTML = "<span class='glyphicon glyphicon-ok'></span> დაყავი";
        document.getElementById('btnClear').innerHTML = "<span class='glyphicon glyphicon-remove'></span> წაშალე";
        document.getElementById('btnUndo').innerHTML = "<span class='glyphicon glyphicon-share-alt rotateHorizontal'></span> შეაერთე";

        document.getElementById('convertTo').innerHTML = "დააკონვერტირე ტექსტი:";
        document.getElementById('convertToGeorgia').innerHTML = "ქართულში";
        document.getElementById('convertToEnglish').innerHTML = "ლათინურში <small>(რეკომენდირებულია Finale-სთვის)</small>";
        document.getElementById('convertToEnglishTrascript').innerHTML = "ლათინურში <small>(ტრანსკრიპციით)</small>";

        /* HELP BUTTON */
        document.getElementById('btnHelp').innerHTML = "<span class='glyphicon glyphicon-cog'></span> დახმარება";
        document.getElementById('helpTitle').innerHTML = "<b>დახმარება</b>";
        //
        var helptext = '<p>სიტყვის დამყოფი არის უფასო ელექტრონული ორ ენოვანი (ქართულ-ინგლისური) პროგრამა, რომელიც ტექსტს ავტომატურად ყოფს მარცვლებად.</p>' +
                       '<p>თავსებადია მუსიკალური ნოტაციის პროგრამებთან (მაგ: <a href="http://www.finalemusic.com/" target="_blank">Finale</a>).  ასევე, მისი გამოყენება შესაძლებელია სასწავლო მიზნით,' +
                           'ქართული ენის შესწავლით დაინტერესებულ უცხოელთათვის. აქვს ქართულ-ლათინური ტრანსლიტერაციის ფუნქცია.' +
                       '</p>' +
                       '<p>' +
                           '<b>შეზღუდვები:</b><br />' +
                           'მარცვლავს მხოლოდ ქართული ენის სიტყვათა დამარცვლის წესების გათვალისწინებით (ინგლისურ ვერსიაშიც).' +
                           'ტრანსლიტერაცია შეუძლია მხოლოდ ქართულიდან ლათინურში.' +
                           'ლათინური ტრანსლიტერაციისას წინადადებას არ იწყებს დიდი ასოებით.' +
                       '</p>' +
                       '<p>შენიშვნები მოგვწერეთ შემდეგ მისამართზე: <b class="btnFont">wordhyphenator@gmail.com</b></p>';
        document.getElementById('helpContent').innerHTML = helptext;

        /* TEXBOXES */
        document.getElementById('txtText').placeholder = "შეიყვანეთ ტექსტი...";
        document.getElementById('txtResult').placeholder = "იხილეთ შედეგი...";

        /* RESULT NOTIFICATIONS */
        document.getElementById('countOfGrains').innerHTML = "მარცვლების რაოდენობა: <span id='lblCharCount' class='customColor'>" + charCount + "</span>";
        document.getElementById('countOfGrainsInSelectedText').innerHTML = "მარცვლების რაოდენობა მონიშნულ ტექსტში: <span id='SelectedVowelCount' class='customColor'>" + charCountInSelectedText + "</span>";

        /* FOOTER */
        document.getElementById('footer').innerHTML = "ყველა უფლება დაცულია &copy; <span id='lblAuthor'>ავტორი: გიგა შუბითიძე</span> 2016 - <span id='getDate'>" + new Date().getFullYear() + "</span> წელი <span class='pull-right'>ვერსია 1.0.0</span>";
    }
}
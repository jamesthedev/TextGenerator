var selectedOpt = 1; //1 = random characters, 2 = random words, 3 = lorem ipsum

$(document).ready(() => {
    //form submit event handler 
    $('#textGenFrm').submit(e => {
        e.preventDefault();
        $('#btnGenerate').click();
    })

    //radio button change event handler
    $('input[type=radio][name=textGenOptions]').change((e) => {
        var selected = $('input[type=radio][name=textGenOptions]:checked')[0].id;
        var numTxt = $("#lblRandomNum")[0];

        switch (selected) {
            case "rdoRandomString" :
                numTxt.innerHTML = "Number of characters:";
                selectedOpt = 1;
                break;
            case "rdoRandomWords" : 
                numTxt.innerHTML = "Number of words:";
                selectedOpt = 2;
                break;
            case "rdoLorem" : 
                numTxt.innerHTML = "Number of words:";
                selectedOpt = 3;
        }
    });

    //generate button click event handler
    $('#btnGenerate').click(() => {
        var randomCount = $('#txtRandomNum').val();

        //validate words/character count input
        if (!randomCount || isNaN(randomCount)) {
            $('#txtRandomNum').css('border', '2px solid red');
            alert("Please enter a valid number of " + (selectedOpt === 1 ? "characters" : "words"));
            return;
        }

        //if valid, clear red border
        else {
            $('#txtRandomNum').css('border', '1px solid grey');
        }

        //generate text
        if (selectedOpt === 1) {
            $('#resultsTxt').val(genRandomCharacters(randomCount));
        }

        else if (selectedOpt === 2) {
            generatedTxt = genRandomWords(randomCount).then(result => { //async because the text file has to be opened
                $('#resultsTxt').val(result);
            });
        }

        else if (selectedOpt === 3) {
            $('#resultsTxt').val(genLoremIpsum(randomCount));
        }
    });

    //copy button click event handler
    $('#btnCopy').click(() => {
        var result = $('#resultsTxt');
        result.select();
        document.execCommand("copy");
    });

    //clear button click event handler
    $('#btnClear').click(() => {
        $('#txtRandomNum').val('');
        $('#resultsTxt').val('');
    });
});

function genRandomCharacters(count) {
    var result = "";

    const charSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-=_+[]{}|`~?/"

    for (let i = 0; i < count; ++i) {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return result;
}

//read dictionary text file into array, get random # of words
function genRandomWords(count) {
    return new Promise((resolve) => {
        fetch('./wordList.txt')
            .then(response => response.text())
            .then((text) => {
                let wordList = text.split("\n");
                
                var result = "";
                for (let i = 0; i < count; ++i) {
                    result += wordList[Math.floor(Math.random() * wordList.length)];
                    result += " ";
                }

                resolve(result);
            }
        );
    });
}

//just repeats the basic lorem ipsum paragraph
function genLoremIpsum(count) {
    var liText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    var liArray = liText.split(" "); //because I'm lazy
    var result = "";

    var index = 0;
    for (var i = 0; i < count; ++i) {
        if (index >= liArray.length) {
            //start reading liArray from beginning again; start new paragraph
            index = 0;
            result += "\n\n";
        }
        
        result += liArray[index] + " ";
        ++index;
    }

    return result;
}
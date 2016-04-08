/* Repopulates the existing form elements with data posted from the last submission, if any.
 *  By making the form sticky client-side, it's easier for us to cache the form itself. */
window.StickyForm = function (jsonString) {
    var postData = JSON.parse(jsonString);
    //console.log(JSON.stringify(postData));
    if (!Array.isArray(postData)) {
        for (input in postData) {
            if (postData.hasOwnProperty(input)) {
                var formElementsWithName = document.getElementsByName(input);

                var formElement = formElementsWithName[0];

                if (formElement) {
                    var formValue = postData[input];
                    var formTag = formElement.tagName.toLowerCase();

                    if (formTag === 'textarea' || formTag === 'select') {
                        formElement.value = formValue;
                        continue;
                    }

                    switch (formElement.type) {
                        case 'text':
                        case 'select':
                        case 'hidden':
                            formElement.value = formValue;
                            continue;
                        case 'checkbox':
                            formElement.checked = (parseInt(formValue, 10) === 1);
                            continue;
                        case 'radio':
                            for (var i = 0; i < formElementsWithName.length; i++) {
                                formElementsWithName[i].checked = (formValue === formElementsWithName[i].value);
                            }
                            continue;
                    }

                    console.warn("Post data for form unused: " + input);
                }

                /* May be multiple select */
                formElement = document.getElementsByName(input + '[]')[0];
                if (formElement && formElement.tagName.toLowerCase() === 'select') {
                    for (var k = 0; k < formElement.options.length; k++) {
                        var selectElem = formElement.options[k];

                        console.log("selectElem.value is " + selectElem.value + ", postData[input] is " + postData[input]);

                        if (postData[input].indexOf(selectElem.value) !== -1) {
                            selectElem.selected = true;
                        }
                    }

                    continue;
                }

                console.warn("No form elements with name " + input + " exist.");
            }
        }
    }
};
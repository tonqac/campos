//**  VIRTUAL KEYBOARD  **//

initVirtualKeyboard = function () {
    var guetos_source = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: guetos
    });

    var initTypeAhead = function (keyboard) {
        keyboard.$preview.typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'guetos',
            source: guetos_source
        });
    };

    $('#inputTitulo').keyboard({
        layout: "custom",
        alwaysOpen: true,
        ignoreEsc: true,
        usePreview: false,
        visible: function (e, keyboard) {
            initTypeAhead(keyboard);
        },
        change: function (e, keyboard) {
            // trigger "input" required for typeahead to recognize a change
            e.type = 'input';
            keyboard.$preview.trigger(e);
        },

        beforeVisible: function (e, keyboard, el) {
            var inModal = $(el).parents('#contenidoBuscador').length > 0;
            if (inModal) {
                keyboard.$keyboard.appendTo($(el).parents('#buscador-titulo'));
            }
        },

        customLayout: {
            'normal': ['1 2 3 4 5 6 7 8 9 0 {bksp}', 'q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m', '{space}'],
            'shift': ['! @ # $ % ( ) _ + {bksp}', 'Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M', '{space}']
        }
    });
}
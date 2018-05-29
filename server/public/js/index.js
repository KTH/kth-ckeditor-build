/* global CKEDITOR, lang */

var editor = CKEDITOR.replace('editor', {
  customConfig: CKEDITOR.getUrl('customConfig.js'),
  language: lang
})

editor.on('loaded', function () {
  if (lang === 'sv' && editor.lang.link.displayText.toLowerCase() === 'display text') {
    // Missing Swedish translation for displayText.
    // Set it like this until it's provided by CKEditor.
    editor.lang.link.displayText = 'Visningstext'
  }
})

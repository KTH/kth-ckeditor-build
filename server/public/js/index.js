/* global CKEDITOR */

const query = new URLSearchParams(window.location.search)
const lang = query.get('l') === 'en' ? 'en' : 'sv'

const editor = CKEDITOR.replace('editor', {
  customConfig: CKEDITOR.getUrl('customConfig.js'),
  embed_provider: '/oembed?url={url}&callback={callback}', // Dummy provider
  language: lang,
})

editor.on('loaded', () => {
  if (lang === 'sv' && editor.lang.link.displayText.toLowerCase() === 'display text') {
    // Missing Swedish translation for displayText.
    // Set it like this until it's provided by CKEditor.
    editor.lang.link.displayText = 'Visningstext'
  }
})

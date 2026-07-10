# KTH CKEditor Build

This package contains a custom build of the [CKEditor](https://ckeditor.com/), specifically [CKEditor 4](https://github.com/ckeditor/ckeditor4). CKEditor 4 reached its end of life on June 30, 2023, and the open source version is no longer maintained. The last open source release was `4.22.1`, which is the version used in this build. The KTH CKEditor Build is developed by KTH and includes custom plugins and configurations. It is no longer actively maintained.

## Installation

```bash
npm install --save-dev @kth/kth-ckeditor-build
```

To use it in your app build, copy files from `node_modules/@kth/kth-ckeditor-build` into your static asset output folder.

```bash
mkdir -p ./dist/js/ckeditor/plugins
cp -R ./node_modules/@kth/kth-ckeditor-build/cssOverrides/. ./dist/js/ckeditor
cp -R ./node_modules/@kth/kth-ckeditor-build/customConfig/customConfig.js ./dist/js/ckeditor
cp -R ./node_modules/@kth/kth-ckeditor-build/plugins/. ./dist/js/ckeditor/plugins
cp -R ./node_modules/@kth/kth-ckeditor-build/ckeditor/. ./dist/js/ckeditor
```

> [!TIP]
>
> If the `customConfig.js` file is not used, please ensure that the `config.versionCheck` property is set to `false` in your own configuration file to avoid a nagging message about the CKEditor version being out of date.

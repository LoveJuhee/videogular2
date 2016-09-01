// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () {
};
function isJsFile(path) {
    return path.slice(-3) == '.js';
}

function isSpecFile(path) {
    return path.slice(-8) == '.spec.js';
}

function isBuiltFile(path) {
    var builtPath = '/base/src/';
    return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
    .filter(isSpecFile)
    .filter(isBuiltFile);

// Load our SystemJS configuration.
System.config(
    {
        baseURL: '/base',
        map: {
            'rxjs': 'node_modules/rxjs',
            '@angular': 'node_modules/@angular',
            'app': 'src'
        },
        packages: {
            'app': {
                main: 'vg-player/vg-player.js',
                defaultExtension: 'js'
            },
            '@angular/core': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            '@angular/compiler': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            '@angular/common': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            '@angular/platform-browser': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            '@angular/platform-browser-dynamic': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            'rxjs': {
                defaultExtension: 'js'
            }
        }
    });

Promise
    .all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ])
    .then(
        function (providers) {
            var testing = providers[0];
            var testingBrowser = providers[1];

            testing.TestBed.initTestEnvironment(
                testingBrowser.BrowserDynamicTestingModule,
                testingBrowser.platformBrowserDynamicTesting()
            );
        }
    )
    .then(
        function () {
            // Finally, load all spec files.
            // This will run the tests directly.
            return Promise.all(
                allSpecFiles.map(function (moduleName) {
                    return System.import(moduleName);
                }));
        }
    )
    .then(
        __karma__.start, __karma__.error
    );


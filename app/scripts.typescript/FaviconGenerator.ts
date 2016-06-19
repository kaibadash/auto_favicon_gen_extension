/// <reference path="../../typings/main.d.ts" />
const SIZE: number = 64;
const GAIN: number = 0.8;

class FaviconGenerator {
    static generate(title: String) {
        FaviconGenerator.faviconExists((exists: Boolean) => {
            if (exists) {
                return;
            }
            FaviconGenerator.draw(title);
        });
    }

    private static draw(title: String) {
        var faviconImage = document.createElement("img");
        var canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;

        var context = canvas.getContext("2d");
        context.font = "normal " + (SIZE/2) + "px sans-serif";
        context.fillStyle = FaviconGenerator.stringToBackgroundColor(title);
        context.fillRect(0, 0, SIZE, SIZE);
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.fillText(title.charAt(0) + title.charAt(1), 0, SIZE/2);
        context.fillText(title.charAt(2) + title.charAt(3), 0, SIZE - 1);

        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = canvas.toDataURL();
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    private static stringToBackgroundColor(s: String) : String {
        var r = FaviconGenerator.fake_srand(s.charCodeAt(0)) % 0xff;
        var g = FaviconGenerator.fake_srand(s.charCodeAt(1)) % 0xff;
        var b = FaviconGenerator.fake_srand(s.charCodeAt(2)) % 0xff;
        if (r + g + b > 0xff * 2) {
            // 明るめの色の場合暗くする
            r *= GAIN;
            g *= GAIN;
            b *= GAIN;
        }
        return "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")";
    }

    private static fake_srand(seed: number) : number {
        return Math.floor(Math.sin(seed) * 10000);
    }

    private static faviconExists(callback: ((exists: Boolean) => void)) {
        var tag: Element = FaviconGenerator.getFaviconTag();
        if (tag != null) {
            return callback(true);
        }
        FaviconGenerator.faviconExistsInDomain((exists: Boolean) => {
            return callback(exists);
        });
    }

    private static getFaviconTag(): Element {
        var links = document.getElementsByTagName("link");

        for (var i = 0, len = links.length; i < len; i++) {
            if ((links[i].getAttribute("rel") || "").match(/\bicon\b/i)) {
                return links[i];
            }
        }
        return null;
    }

    private static faviconExistsInDomain(callback: ((exists: Boolean) => void)) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/favicon.ico", true);
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 404) {
                callback(false);
            }
        };
        xhr.onerror = () => {
            callback(true);
        };
        xhr.send(null);
        callback(true);
    }
}

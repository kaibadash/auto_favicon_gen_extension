/// <reference path="../../typings/main.d.ts" />
const size: number = 64;

class FaviconGenerator {
    static generate(title: String) {
        FaviconGenerator.faviconExists((exists: Boolean) => {
            if (exists) {
                console.log("favicon exists");
                return;
            }
            console.log("favicon is not found");
            var faviconImage = document.createElement("img");
            var canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            
            var context = canvas.getContext("2d");
            context.font = "normal " + (size/2) + "px sans-serif";
            context.fillStyle = FaviconGenerator.stringToBackgroundColor(title);
            context.fillRect(0, 0, size, size);
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.fillText(title.charAt(0) + title.charAt(1), 0, size/2);
            context.fillText(title.charAt(2) + title.charAt(3), 0, size - 1);
            
            var link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            console.log("data:" + canvas.toDataURL());
            link.href = canvas.toDataURL();
            document.getElementsByTagName('head')[0].appendChild(link);           
        });
    }

    private static stringToBackgroundColor(s: String) : String {
        var rc = s.length < 1 ? "0" : s[0];
        var gc = s.length < 2 ? "0" : s[1];
        var bc = s.length < 3 ? "0" : s[2];
        var r = rc.charCodeAt(0) % 0xff;
        var g = gc.charCodeAt(0) % 0xff;
        var b = bc.charCodeAt(0) % 0xff;
        if (r+g+b > 0xff) {
            // 明るめの色の場合暗くする
            r /= 2;
            g /= 2;
            b /= 2;
        }
        console.log("rgb:" + r + "," + g + "," + b);
        return "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")";
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
            console.log("xhr.readyState" + xhr.readyState);
            console.log("xhr.status" + xhr.status);
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
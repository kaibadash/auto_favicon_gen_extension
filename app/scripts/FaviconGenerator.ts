const SIZE = 64;
const GAIN = 0.8;

export class FaviconGenerator {
  static generate(title: string): void {
    FaviconGenerator.faviconExists((exists: boolean) => {
      if (exists) {
        return;
      }
      FaviconGenerator.draw(title);
    });
  }

  private static draw(title: string) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;

    const context = canvas.getContext('2d');
    if (context == null) return;
    context.font = 'normal ' + SIZE / 2 + 'px sans-serif';
    context.fillStyle = FaviconGenerator.stringToBackgroundColor(title);
    context.fillRect(0, 0, SIZE, SIZE);
    context.strokeStyle = 'white';
    context.fillStyle = 'white';
    context.fillText(title.charAt(0) + title.charAt(1), 0, SIZE / 2);
    context.fillText(title.charAt(2) + title.charAt(3), 0, SIZE - 1);

    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = canvas.toDataURL();
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  private static stringToBackgroundColor(s: string): string {
    let r = FaviconGenerator.fake_srand(s.charCodeAt(0)) % 0xff;
    let g = FaviconGenerator.fake_srand(s.charCodeAt(1)) % 0xff;
    let b = FaviconGenerator.fake_srand(s.charCodeAt(2)) % 0xff;
    if (r + g + b > 0xff * 2) {
      // 明るめの色の場合暗くする
      r *= GAIN;
      g *= GAIN;
      b *= GAIN;
    }
    return 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
  }

  private static fake_srand(seed: number): number {
    return Math.floor(Math.sin(seed) * 10000);
  }

  private static faviconExists(callback: (exists: boolean) => void) {
    const tag: Element | null = FaviconGenerator.getFaviconTag();
    if (tag != null) {
      return callback(true);
    }
    FaviconGenerator.faviconExistsInDomain((exists: boolean) => {
      return callback(exists);
    });
  }

  private static getFaviconTag(): Element | null {
    const links = document.getElementsByTagName('link');

    for (let i = 0, len = links.length; i < len; i++) {
      if ((links[i].getAttribute('rel') || '').match(/\bicon\b/i)) {
        return links[i];
      }
    }
    return null;
  }

  private static faviconExistsInDomain(callback: (exists: boolean) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/favicon.ico', true);
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

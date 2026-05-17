import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'assets', 'lexipair-icon.svg');
const publicDir = path.join(root, 'public');
const iosIconDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');

const iosIcons = [
  ['AppIcon-20x20@1x.png', 20],
  ['AppIcon-20x20@2x.png', 40],
  ['AppIcon-20x20@3x.png', 60],
  ['AppIcon-29x29@1x.png', 29],
  ['AppIcon-29x29@2x.png', 58],
  ['AppIcon-29x29@3x.png', 87],
  ['AppIcon-40x40@1x.png', 40],
  ['AppIcon-40x40@2x.png', 80],
  ['AppIcon-40x40@3x.png', 120],
  ['AppIcon-60x60@2x.png', 120],
  ['AppIcon-60x60@3x.png', 180],
  ['AppIcon-76x76@1x.png', 76],
  ['AppIcon-76x76@2x.png', 152],
  ['AppIcon-83.5x83.5@2x.png', 167],
  ['AppIcon-1024x1024@1x.png', 1024]
];

const contents = {
  images: [
    { filename: 'AppIcon-20x20@1x.png', idiom: 'iphone', scale: '1x', size: '20x20' },
    { filename: 'AppIcon-20x20@2x.png', idiom: 'iphone', scale: '2x', size: '20x20' },
    { filename: 'AppIcon-20x20@3x.png', idiom: 'iphone', scale: '3x', size: '20x20' },
    { filename: 'AppIcon-29x29@1x.png', idiom: 'iphone', scale: '1x', size: '29x29' },
    { filename: 'AppIcon-29x29@2x.png', idiom: 'iphone', scale: '2x', size: '29x29' },
    { filename: 'AppIcon-29x29@3x.png', idiom: 'iphone', scale: '3x', size: '29x29' },
    { filename: 'AppIcon-40x40@1x.png', idiom: 'iphone', scale: '1x', size: '40x40' },
    { filename: 'AppIcon-40x40@2x.png', idiom: 'iphone', scale: '2x', size: '40x40' },
    { filename: 'AppIcon-40x40@3x.png', idiom: 'iphone', scale: '3x', size: '40x40' },
    { filename: 'AppIcon-60x60@2x.png', idiom: 'iphone', scale: '2x', size: '60x60' },
    { filename: 'AppIcon-60x60@3x.png', idiom: 'iphone', scale: '3x', size: '60x60' },
    { filename: 'AppIcon-76x76@1x.png', idiom: 'ipad', scale: '1x', size: '76x76' },
    { filename: 'AppIcon-76x76@2x.png', idiom: 'ipad', scale: '2x', size: '76x76' },
    { filename: 'AppIcon-83.5x83.5@2x.png', idiom: 'ipad', scale: '2x', size: '83.5x83.5' },
    { filename: 'AppIcon-1024x1024@1x.png', idiom: 'ios-marketing', scale: '1x', size: '1024x1024' }
  ],
  info: { author: 'xcode', version: 1 }
};

await fs.mkdir(publicDir, { recursive: true });
await sharp(source).png().resize(1024, 1024).toFile(path.join(publicDir, 'icon-1024.png'));
await sharp(source).png().resize(192, 192).toFile(path.join(publicDir, 'icon-192.png'));
await sharp(source).png().resize(512, 512).toFile(path.join(publicDir, 'icon-512.png'));

try {
  await fs.access(path.join(root, 'ios'));
  await fs.mkdir(iosIconDir, { recursive: true });
  await Promise.all(iosIcons.map(([filename, size]) => (
    sharp(source).png().resize(size, size).toFile(path.join(iosIconDir, filename))
  )));
  await fs.writeFile(path.join(iosIconDir, 'Contents.json'), JSON.stringify(contents, null, 2));
  console.log(`Generated web icons and iOS AppIcon set in ${iosIconDir}`);
} catch {
  console.log('Generated web icons. Run `npx cap add ios`, then rerun this script for iOS AppIcon assets.');
}

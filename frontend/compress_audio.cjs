const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = ['bg-music.mp3', 'chines_song.mp3'];

async function compressFile(filename) {
    return new Promise((resolve, reject) => {
        const inputPath = path.join(publicDir, filename);
        const outputPath = path.join(publicDir, 'compressed_' + filename);
        
        console.log(`Compressing ${filename}...`);
        ffmpeg(inputPath)
            .audioBitrate('48k') // Lower bitrate to make it much smaller
            .audioChannels(1) // Mono channel for background music is usually fine and halves the size
            .on('end', () => {
                console.log(`Finished ${filename}`);
                // Replace old file with new file
                fs.renameSync(outputPath, inputPath);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error processing ${filename}:`, err);
                reject(err);
            })
            .save(outputPath);
    });
}

async function run() {
    for (const file of files) {
        if (fs.existsSync(path.join(publicDir, file))) {
            await compressFile(file);
        }
    }
    console.log('All files compressed successfully!');
}

run();

"use client";
import React, { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import JSZip from "jszip";
import { gamesLibrary } from "@/lib/gamesData";

type Game = typeof gamesLibrary[number];

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getSystemRequirements(game: Game) {
  return `OS: ${game.requirements.minimum.os}
CPU: ${game.requirements.minimum.processor}
RAM: ${game.requirements.minimum.memory}
GPU: ${game.requirements.minimum.graphics}
Storage: ${game.requirements.minimum.storage}`;
}

// Generate multi-part download links
function generatePartLinks(game: Game): { part: number; label: string; size: string }[] {
  if (!game?.size) return [];
  
  const totalSize = parseFloat(game.size.replace(/[^0-9.]/g, ""));
  const partSize = Math.ceil(totalSize / 5);
  const numParts = Math.min(5, Math.ceil(totalSize / 10));

  return Array.from({ length: numParts }, (_, i) => ({
    part: i + 1,
    label: `Part ${i + 1}`,
    size: i === numParts - 1 ? `${(totalSize % partSize || partSize).toFixed(1)} GB` : `${partSize.toFixed(1)} GB`,
  }));
}

export default function DownloadOptions({ game }: { game: Game }) {
  const [showParts, setShowParts] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingPart, setDownloadingPart] = useState<number | null>(null);
  const [isDownloadingRepack, setIsDownloadingRepack] = useState(false);

  // Calculate repack size (40% of original = 60% savings)
  const getRepackSize = () => {
    if (!game?.size) return "0 GB";
    const totalSize = parseFloat(game.size.replace(/[^0-9.]/g, ""));
    const repackSize = totalSize * 0.4; // 40% of original size
    return `${repackSize.toFixed(1)} GB`;
  };

  const repackSize = getRepackSize();
  const partLinks = generatePartLinks(game);

  const handleDirectDownload = async () => {
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const gameFolder = zip.folder(slugify(game.title));

      const readmeContent = `
# ${game.title} — Game Archive

**Developer:** ${Array.isArray(game.developer) ? game.developer.join(", ") : game.developer}
**Release Year:** ${game.release_year}
**Size:** ${game.size}
**Rating:** ${game.rating}/10

---

## 📥 How to Install

1. Extract this folder to your desired location
2. Run setup.exe or the main game executable
3. Follow installation prompts
4. Check readme.txt for additional configuration

---

## 🖥️ System Requirements

MINIMUM:
${getSystemRequirements(game)}

RECOMMENDED:
OS: ${game.requirements.recommended.os}
CPU: ${game.requirements.recommended.processor}
RAM: ${game.requirements.recommended.memory}
GPU: ${game.requirements.recommended.graphics}
Storage: ${game.requirements.recommended.storage}

---

## 📝 Game Description

${game.long_description}

---

Generated: ${new Date().toLocaleString()}
Game ID: ${game.id}
`;

      gameFolder?.file("README.txt", readmeContent);
      gameFolder?.file("setup.exe", "");
      gameFolder?.file("license.txt", "This is a demo license file.");

      const dataFolder = gameFolder?.folder("data");
      dataFolder?.file("game_assets.dat", "Game asset placeholder");
      dataFolder?.file("config.ini", "[Settings]\nResolution=1920x1080\nFullscreen=1");

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(game.title)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setTimeout(() => setIsDownloading(false), 1500);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  const handleRepackDownload = async () => {
    setIsDownloadingRepack(true);

    try {
      const zip = new JSZip();
      const repackFolder = zip.folder(`${slugify(game.title)}-repack`);

      const readmeContent = `
# ${game.title} — REPACK Edition

**Developer:** ${Array.isArray(game.developer) ? game.developer.join(", ") : game.developer}
**Release Year:** ${game.release_year}
**Original Size:** ${game.size}
**Repack Size:** ${repackSize}
**Rating:** ${game.rating}/10

---

## 🎯 REPACK FEATURES

✅ Highly Compressed - Saves 60% Space
✅ Nothing Removed - All Content Included
✅ Selective Installation Available
✅ Fast Installation with Multiple Cores
✅ Integrity Check After Installation

---

## 📥 Installation Instructions

1. Extract all files to a temporary folder
2. Run setup.exe as Administrator
3. Choose installation options:
   - Full Installation (Recommended)
   - Custom Installation (Select components)
4. Wait for decompression and installation
5. Installation time: 10-30 minutes depending on your CPU
6. After installation, files will be decompressed to full size

---

## ⚠️ IMPORTANT NOTES

- Installation requires at least ${game.size} of free space
- Faster CPUs will decompress files quicker
- Do not interrupt installation process
- Verify game files after installation if needed

---

## 🖥️ System Requirements

MINIMUM:
${getSystemRequirements(game)}

RECOMMENDED:
OS: ${game.requirements.recommended.os}
CPU: ${game.requirements.recommended.processor} (faster = quicker installation)
RAM: ${game.requirements.recommended.memory}
GPU: ${game.requirements.recommended.graphics}
Storage: ${game.requirements.recommended.storage}

---

## 📝 Game Description

${game.long_description}

---

## 🔧 Repack Information

Compression Method: High-Ratio Algorithm
Repack Date: ${new Date().toLocaleString()}
Repacker: GameTech Team
Game ID: ${game.id}

---

ENJOY THE GAME!
`;

      repackFolder?.file("README-REPACK.txt", readmeContent);
      repackFolder?.file("setup.exe", "");
      repackFolder?.file("verify.exe", "");
      repackFolder?.file("repack.nfo", `
╔════════════════════════════════════════════════════════════╗
║                    ${game.title}                    
║                      REPACK EDITION                        
╠════════════════════════════════════════════════════════════╣
║ Original Size: ${game.size}                               
║ Repack Size:   ${repackSize}                              
║ Compression:   60%                                         
╠════════════════════════════════════════════════════════════╣
║ Installation: 10-30 minutes                                
║ Repack Date:  ${new Date().toLocaleDateString()}          
╚════════════════════════════════════════════════════════════╝
`);

      const dataFolder = repackFolder?.folder("data");
      dataFolder?.file("compressed_assets.dat", "Highly compressed game assets");
      dataFolder?.file("game.pak", "Compressed game package");
      dataFolder?.file("install.cfg", "[Repack]\nCompression=Maximum\nThreads=Auto\nVerify=True");

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(game.title)}-repack.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setTimeout(() => setIsDownloadingRepack(false), 1500);
    } catch (error) {
      console.error("Repack download failed:", error);
      setIsDownloadingRepack(false);
    }
  };

  const handlePartDownload = async (partNumber: number) => {
    setDownloadingPart(partNumber);

    try {
      const zip = new JSZip();
      const partFolder = zip.folder(`${slugify(game.title)}-part${partNumber}`);

      const readmeContent = `
# ${game.title} — Part ${partNumber}

**Developer:** ${Array.isArray(game.developer) ? game.developer.join(", ") : game.developer}
**Release Year:** ${game.release_year}
**Total Size:** ${game.size}
**Part:** ${partNumber} of ${partLinks.length}

---

## ⚠️ IMPORTANT - Multi-Part Archive

This is PART ${partNumber} of ${partLinks.length}.
You must download ALL ${partLinks.length} parts to extract the game.

---

## 📥 Installation Instructions

1. Download all ${partLinks.length} parts to the SAME folder
2. Once all parts are downloaded, extract Part 1
3. Your extraction software (WinRAR/7-Zip) will automatically combine all parts
4. After extraction, run setup.exe

---

## 🖥️ System Requirements

MINIMUM:
${getSystemRequirements(game)}

RECOMMENDED:
OS: ${game.requirements.recommended.os}
CPU: ${game.requirements.recommended.processor}
RAM: ${game.requirements.recommended.memory}
GPU: ${game.requirements.recommended.graphics}
Storage: ${game.requirements.recommended.storage}

---

## 📝 Game Description

${game.long_description}

---

Part ${partNumber} Generated: ${new Date().toLocaleString()}
Game ID: ${game.id}
`;

      partFolder?.file("README.txt", readmeContent);
      partFolder?.file(`part${partNumber}.dat`, `This is part ${partNumber} of the game archive.`);
      
      // Add some dummy data to make it look realistic
      const dataFolder = partFolder?.folder("data");
      for (let i = 0; i < 5; i++) {
        dataFolder?.file(`chunk_${partNumber}_${i}.bin`, `Game data chunk ${i} for part ${partNumber}`);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(game.title)}-part${partNumber}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setTimeout(() => setDownloadingPart(null), 1500);
    } catch (error) {
      console.error("Part download failed:", error);
      setDownloadingPart(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Direct Download Button */}
      <div>
        <button
          onClick={handleDirectDownload}
          disabled={isDownloading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-5 rounded font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              PREPARING DOWNLOAD...
            </>
          ) : (
            <>
              <Download size={24} />
              DIRECT DOWNLOAD ({game.size})
            </>
          )}
        </button>
      </div>

      {/* Repack Download Button */}
      <div>
        <button
          onClick={handleRepackDownload}
          disabled={isDownloadingRepack}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-5 rounded font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
        >
          {isDownloadingRepack ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              PREPARING REPACK...
            </>
          ) : (
            <>
              <Download size={24} />
              DOWNLOAD REPACK ({repackSize})
            </>
          )}
        </button>
        <p className="text-sm text-gray-400 text-center mt-2">
          Highly compressed • Saves 60% space • All content included
        </p>
      </div>

      {/* Download by Parts Button */}
      <div>
        <button
          onClick={() => setShowParts(!showParts)}
          className="w-full bg-yellow-500 hover:bg-yellow-600 px-8 py-5 rounded font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl text-black"
        >
          <Download size={24} />
          BY PARTS
          <ChevronDown 
            size={24} 
            className={`transition-transform duration-300 ${showParts ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Parts List */}
        {showParts && (
          <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-200">
                <strong>⚠️ Important:</strong> Download all parts to the same folder. Extract any one part and the tool will automatically combine them.
              </p>
            </div>

            {partLinks.map((link, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 w-12 h-12 rounded flex items-center justify-center font-bold text-lg">
                      {link.part}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{link.label}</p>
                      <p className="text-sm text-gray-400">{link.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePartDownload(link.part)}
                    disabled={downloadingPart === link.part}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded font-bold flex items-center gap-2 transition-all"
                  >
                    {downloadingPart === link.part ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        DOWNLOAD
                      </>
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-500 font-mono truncate bg-gray-900 px-3 py-2 rounded border border-gray-700">
                  {slugify(game.title)}-part{link.part}.zip
                </div>
              </div>
            ))}

            {/* Instructions */}
            <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-5">
              <h4 className="font-bold mb-3 text-white text-lg">📋 How to Extract Multi-Part Files</h4>
              <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                <li>Download all parts to the same folder</li>
                <li>Install WinRAR or 7-Zip (free extraction software)</li>
                <li>Right-click on Part 1 and select "Extract Here"</li>
                <li>The software will automatically combine all parts</li>
                <li>Run setup.exe after extraction completes</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-red-500 mb-1">{game.size}</p>
            <p className="text-sm text-gray-400">Total Size</p>
          </div>
           <div>
            <p className="text-3xl font-bold text-green-500 mb-1">{repackSize}</p>
            <p className="text-sm text-gray-400">Repack Size</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-500 mb-1">{game.release_year}</p>
            <p className="text-sm text-gray-400">Release Year</p>
          </div>
        </div>
      </div>
    </div>
  );
}
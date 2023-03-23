/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the MIT    *
 * License. To use or modify it you must  *
 * accept the terms of the license.       *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const CoordinateUtils = require("./CoordinateUtils");

class World {
    generatorManager;
    chunks;

    constructor(generatorManager) {
        this.generatorManager = generatorManager;
        this.chunks = new Map();
    }

    loadChunk(x, z) {
        return new Promise((resolve) => {
            let xz = CoordinateUtils.hashXZ(x, z);
            let loadChunkTask = setInterval(() => {
                if (!this.chunks.has(xz)) {
                    if (false === false) {
                        this.chunks.set(xz, null);
                        this.getGenerator()
                            .generate(x, z)
                            .then((value) => {
                                this.chunks.set(xz, value);
                                clearInterval(loadChunkTask);
                                resolve(this.chunks.get(xz));
                            });
                    } else {
                    }
                } else {
                    let chunk = this.chunks.get(xz);
                    if (chunk !== null) {
                        clearInterval(loadChunkTask);
                        resolve(chunk);
                    }
                }
            }, 10);
        });
    }

    async unloadChunk(x, z) {
        let xz = CoordinateUtils.hashXZ(x, z);
        await this.saveChunk();
        if (this.chunks.has(xz)) {
            this.chunks.delete(xz);
        }
    }

    async saveChunk(x, z) {}

    getGenerator() {
        return this.generatorManager.getGenerator("flat");
    }

    getBlockRuntimeID(x, y, z, layer) {
        let xz = CoordinateUtils.hashXZ(x >> 4, z >> 4);
        return this.chunks.get(xz).getBlockRuntimeID(x & 0x0f, y, z & 0x0f, layer);
    }

    setBlockRuntimeID(x, y, z, layer, runtimeID) {
        let xz = CoordinateUtils.hashXZ(x >> 4, z >> 4);
        this.chunks.get(xz).setBlockRuntimeID(x & 0x0f, y, z & 0x0f, layer, runtimeID);
    }
}

module.exports = World;

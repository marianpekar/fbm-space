class Utils {
    static Lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
    
    static Fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }   
}

class Noise {
    constructor() {
        this.p = [];
        this.permutationTable = [];
        this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], 
        [-1, -1, 0], [1, 0, 1], [-1, 0, 1], 
        [1, 0, -1], [-1, 0, -1], [0, 1, 1], 
        [0, -1, 1], [0, 1, -1], [0, -1, -1]];

        for (let i = 0; i < 256; i++)
            this.p[i] = Math.floor(Math.random() * 256);
    
        for (let i = 0; i < 512; i++)
            this.permutationTable[i] = this.p[i & 255];
    }
          
    PerlinDot(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }             
    
    PerlinNoise(x, y, z) {
        let a = Math.floor(x);
        let b = Math.floor(y);
        let c = Math.floor(z);
        
        x = x - a;
        y = y - b;
        z = z - c;
    
        a &= 255;
        b &= 255;
        c &= 255;
    
        let gi000 = this.permutationTable[a + this.permutationTable[b + this.permutationTable[c]]] % 12;
        let gi001 = this.permutationTable[a + this.permutationTable[b + this.permutationTable[c + 1]]] % 12;
        let gi010 = this.permutationTable[a + this.permutationTable[b + 1 + this.permutationTable[c]]] % 12;
        let gi011 = this.permutationTable[a + this.permutationTable[b + 1 + this.permutationTable[c + 1]]] % 12;
        let gi100 = this.permutationTable[a + 1 + this.permutationTable[b + this.permutationTable[c]]] % 12;
        let gi101 = this.permutationTable[a + 1 + this.permutationTable[b + this.permutationTable[c + 1]]] % 12;
        let gi110 = this.permutationTable[a + 1 + this.permutationTable[b + 1 + this.permutationTable[c]]] % 12;
        let gi111 = this.permutationTable[a + 1 + this.permutationTable[b + 1 + this.permutationTable[c + 1]]] % 12;
    
        let n000 = this.PerlinDot(this.grad3[gi000], x, y, z);
        let n100 = this.PerlinDot(this.grad3[gi100], x - 1, y, z);
        let n010 = this.PerlinDot(this.grad3[gi010], x, y - 1, z);
        let n110 = this.PerlinDot(this.grad3[gi110], x - 1, y - 1, z);
        let n001 = this.PerlinDot(this.grad3[gi001], x, y, z - 1);
        let n101 = this.PerlinDot(this.grad3[gi101], x - 1, y, z - 1);
        let n011 = this.PerlinDot(this.grad3[gi011], x, y - 1, z - 1);
        let n111 = this.PerlinDot(this.grad3[gi111], x - 1, y - 1, z - 1);
    
        let u = Utils.Fade(x);
        let v = Utils.Fade(y);
        let w = Utils.Fade(z);
    
        let nx00 = Utils.Lerp(n000, n100, u);
        let nx01 = Utils.Lerp(n001, n101, u);
        let nx10 = Utils.Lerp(n010, n110, u);
        let nx11 = Utils.Lerp(n011, n111, u);
    
        let nxy0 = Utils.Lerp(nx00, nx10, v);
        let nxy1 = Utils.Lerp(nx01, nx11, v);
    
        return Utils.Lerp(nxy0, nxy1, w);
    }

    FractalBrownianMotion(x, y, z, octaves, persistence) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        
        for(let i = 0; i < octaves; i++) {
            total = this.PerlinNoise(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }

    CreateFBMCube(size, xOffset, yOffset, zOffset, xScale, yScale, zScale, octaves, persistence) {
        let fbmArray = [];
        
        for(let x = 0; x < size; x++)
            for(let y = 0; y < size; y++)
                for(let z = 0; z < size; z++) {
                    let f =  this.FractalBrownianMotion((x + xOffset) * xScale, (y + yOffset) * yScale, (z + zOffset) * zScale, octaves, persistence);
                    fbmArray.push(f);                                                  
                }
            
        let vectors = [];
        for(let i = 0; i < fbmArray.length; i += 3) {
            let v = {x:0,y:0,z:0};
            v.x = fbmArray[i];
            v.y = fbmArray[i+1];
            v.z = fbmArray[i+2];
            vectors.push(v);
        }
    
        return vectors;
    }
}

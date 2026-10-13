export type SupportedImageMime="image/jpeg"|"image/png"|"image/webp";
export function hasValidImageSignature(bytes:Uint8Array,mime:string):mime is SupportedImageMime{
 if(mime==="image/jpeg")return bytes.length>=4&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
 if(mime==="image/png")return bytes.length>=8&&[137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b);
 if(mime==="image/webp")return bytes.length>=12&&[82,73,70,70].every((b,i)=>bytes[i]===b)&&[87,69,66,80].every((b,i)=>bytes[8+i]===b);
 return false;
}

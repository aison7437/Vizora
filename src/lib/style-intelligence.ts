export type WardrobeItem={id:string;name:string;category:string;color:string};
type Preferences={preferred_colors:string[];avoid_colors:string[];style_notes:string};
const slots:Record<string,string[][]>={
 everyday:[["top","dress"],["bottom"],["footwear"],["outerwear","accessory"]],
 work:[["top","dress"],["bottom"],["footwear"],["outerwear","accessory"]],
 date:[["dress","top"],["bottom"],["footwear"],["accessory","outerwear"]],
 event:[["dress","top"],["bottom"],["footwear"],["accessory","outerwear"]]
};
export function buildStyleIntelligence(input:{occasion:string;budgetKsh:number;preferences:Preferences;items:WardrobeItem[]}){
 const {occasion,budgetKsh,preferences,items}=input;
 const avoid=new Set(preferences.avoid_colors.map(c=>c.trim().toLowerCase()));
 const liked=new Set(preferences.preferred_colors.map(c=>c.trim().toLowerCase()));
 const valid=items.filter(i=>!avoid.has(i.color.trim().toLowerCase()));
 const ranked=[...valid].sort((a,b)=>Number(liked.has(b.color.toLowerCase()))-Number(liked.has(a.color.toLowerCase()))||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
 const selected:WardrobeItem[]=[];const used=new Set<string>();
 for(const group of slots[occasion]??slots.everyday){
  const item=ranked.find(i=>group.includes(i.category)&&!used.has(i.id));
  if(item){selected.push(item);used.add(item.id)}
 }
 // Dresses are standalone outfits: never require bottoms with a dress.
 const outfit=selected.some(i=>i.category==="dress")?selected.filter(i=>i.category!=="bottom"):selected;
 const hasBody=outfit.some(i=>["top","dress"].includes(i.category));
 const hasBottom=outfit.some(i=>i.category==="bottom"||i.category==="dress");
 const hasShoes=outfit.some(i=>i.category==="footwear");
 const missing=[...(!hasBody?["top or dress"]:[]),...(!hasBottom?["bottom"]:[]),...(!hasShoes?["footwear"]:[])];
 return {
  version:"v4.1",occasion,budget:{currency:"KES",maximum:budgetKsh,estimatedSpend:0,verifiedRetailPrices:false},
  styleDNA:{preferredColors:preferences.preferred_colors,avoidColors:preferences.avoid_colors,notes:preferences.style_notes,wardrobeItemCount:items.length},
  wardrobeRemix:{outfit,complete:missing.length===0,missingCategories:missing},
  budgetGuidance:missing.length===0?"Your existing wardrobe covers the essential outfit categories; no purchase is required.":"Try borrowing, reusing or repairing missing categories before buying. No live product prices are available.",
  transparency:"Deterministic wardrobe suggestions based on saved preferences. No image transformation, product pricing or live AI inference."
 };
}

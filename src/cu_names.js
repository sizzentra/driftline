// 0.4.9 deep QC: no two fish share a name (the Fish Log showed two "Brook Trout", and a few old waters had a name twice). Saves key fish by
// id, so renaming is safe. The older fish keeps its name; the later one gets a distinct real or regional name.
{ const REN={spottedgar:'Shortnose Gar', brooktrout:'Native Brook Trout', rk_brooktrout:'Glacier Brook Trout', arcticgrayling:'Frostbite Grayling', rk_arcticgrayling:'Bow River Grayling',
  rk_walleye:'Prairie Walleye', rk_muskellunge:'Tiger Muskie', rk_tigertrout:'Banff Tiger Trout', am_goldendorado:'River Tiger Dorado', shorecrab:'Green Shore Crab', ballanwrasse:'Cuckoo Wrasse',
  af_dogfish:'Puppy Dogfish', bluefintuna:'Giant Bluefin', fk_goliathgrouper:'Spotted Goliath Grouper', rk_burbot:'Eelpout Burbot', rk_laketrout:'Mackinaw Lake Trout', arcticchar:'Silver Arctic Char',
  rk_lakewhitefish:'Humpback Whitefish', fk_sergeantmajor:'Night Sergeant', af_goatfish:'Billy Goatfish', fk_lionfish:'Red Lionfish', fk_hogfish:'Spanish Hogfish', am_hatchetfish:'Marbled Hatchetfish',
  blackdragon:'Scaleless Black Dragonfish', rk_brookstickleback:'Ninespine Stickleback', rk_rainbowtrout:'Kamloops Rainbow', rk_lakesturgeon:'Fraser Lake Sturgeon', fk_pilchard:'Scaled Sardine',
  af_pigfish:'Piglet Fish', am_peacockbass:'Speckled Peacock Bass'};
  for(const id in REN) if(SPI[id]) SPI[id].name=REN[id]; }

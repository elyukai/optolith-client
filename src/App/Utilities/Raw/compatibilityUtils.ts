import { lt, lte, satisfies } from "semver";
import { ident } from "../../../Data/Function";
import { all } from "../../../Data/List";
import { bindF, fromMaybe, Maybe, maybe_ } from "../../../Data/Maybe";
import { lookupF } from "../../../Data/OrderedMap";
import { StringKeyObject } from "../../../Data/Record";
import { Culture } from "../../Models/Wiki/Culture";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { IncreaseSkill } from "../../Models/Wiki/sub/IncreaseSkill";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getBlessedTradStrIdFromNumId, getMagicalTraditionInstanceIdByNumericId } from "../IDUtils";
import { hasOwnProperty } from "../Object";
import { pipe, pipe_ } from "../pipe";
import { isNumber } from "../typeCheckUtils";
import { RawActiveObject, RawCustomItem, RawHero } from "./RawData";

const WA = WikiModel.A

// tslint:disable-next-line:variable-name
const convertLowerThan0_49_5 = (hero: RawHero): RawHero => {
  const entry = { ...hero }

  const newActivatable: StringKeyObject<RawActiveObject[]> = {}

  const convertIds: StringKeyObject<RawActiveObject & { id: string }> = {
    "SA_6": { id: "SA_5", tier: 2 },
    "SA_7": { id: "SA_6" },
    "SA_8": { id: "SA_7" },
    "SA_9": { id: "SA_8" },
    "SA_10": { id: "SA_9" },
    "SA_11": { id: "SA_10" },
    "SA_12": { id: "SA_11" },
    "SA_13": { id: "SA_12" },
    "SA_14": { id: "SA_13" },
    "SA_15": { id: "SA_14" },
    "SA_16": { id: "SA_15" },
    "SA_17": { id: "SA_16" },
    "SA_18": { id: "SA_17" },
    "SA_19": { id: "SA_18" },
    "SA_20": { id: "SA_19" },
    "SA_21": { id: "SA_20" },
    "SA_22": { id: "SA_21" },
    "SA_23": { id: "SA_22" },
    "SA_24": { id: "SA_23" },
    "SA_25": { id: "SA_24" },
    "SA_26": { id: "SA_25" },
    "SA_27": { id: "SA_26" },
    "SA_28": { id: "SA_27" },
    "SA_29": { id: "SA_28" },
    "SA_30": { id: "SA_29" },
    "SA_31": { id: "SA_30" },
    "SA_32": { id: "SA_31" },
    "SA_33": { id: "SA_32" },
    "SA_34": { id: "SA_33" },
    "SA_35": { id: "SA_34" },
    "SA_36": { id: "SA_35" },
    "SA_37": { id: "SA_36" },
    "SA_38": { id: "SA_37" },
    "SA_39": { id: "SA_38" },
    "SA_40": { id: "SA_39" },
    "SA_41": { id: "SA_40" },
    "SA_42": { id: "SA_41", tier: 1 },
    "SA_43": { id: "SA_41", tier: 2 },
    "SA_44": { id: "SA_42", tier: 1 },
    "SA_45": { id: "SA_42", tier: 2 },
    "SA_46": { id: "SA_43" },
    "SA_47": { id: "SA_44" },
    "SA_48": { id: "SA_45" },
    "SA_49": { id: "SA_46" },
    "SA_50": { id: "SA_47" },
    "SA_51": { id: "SA_48", tier: 1 },
    "SA_52": { id: "SA_48", tier: 2 },
    "SA_53": { id: "SA_48", tier: 3 },
    "SA_54": { id: "SA_49" },
    "SA_55": { id: "SA_50" },
    "SA_56": { id: "SA_51", tier: 1 },
    "SA_57": { id: "SA_51", tier: 2 },
    "SA_58": { id: "SA_51", tier: 3 },
    "SA_59": { id: "SA_52" },
    "SA_60": { id: "SA_53" },
    "SA_61": { id: "SA_54" },
    "SA_62": { id: "SA_55", tier: 1 },
    "SA_63": { id: "SA_55", tier: 2 },
    "SA_64": { id: "SA_55", tier: 3 },
    "SA_65": { id: "SA_56", tier: 1 },
    "SA_66": { id: "SA_56", tier: 2 },
    "SA_67": { id: "SA_56", tier: 3 },
    "SA_68": { id: "SA_57" },
    "SA_69": { id: "SA_58", tier: 1 },
    "SA_70": { id: "SA_58", tier: 2 },
    "SA_71": { id: "SA_59" },
    "SA_72": { id: "SA_60" },
    "SA_73": { id: "SA_61" },
    "SA_74": { id: "SA_62" },
    "SA_75": { id: "SA_63" },
    "SA_76": { id: "SA_64", tier: 1 },
    "SA_77": { id: "SA_64", tier: 2 },
    "SA_78": { id: "SA_64", tier: 3 },
    "SA_79": { id: "SA_65" },
    "SA_80": { id: "SA_66" },
    "SA_81": { id: "SA_67", tier: 1 },
    "SA_82": { id: "SA_67", tier: 2 },
    "SA_83": { id: "SA_67", tier: 3 },
    "SA_84": { id: "SA_68" },
    "SA_85": { id: "SA_69" },
    "SA_86": { id: "SA_70" },
    "SA_87": { id: "SA_71" },
    "SA_88": { id: "SA_72" },
    "SA_89": { id: "SA_73" },
    "SA_90": { id: "SA_74" },
    "SA_91": { id: "SA_75" },
    "SA_92": { id: "SA_76" },
    "SA_93": { id: "SA_77" },
    "SA_94": { id: "SA_78" },
    "SA_95": { id: "SA_79" },
    "SA_96": { id: "SA_80" },
    "SA_97": { id: "SA_81" },
    "SA_98": { id: "SA_82" },
    "SA_99": { id: "SA_83" },
    "SA_100": { id: "SA_84" },
    "SA_101": { id: "SA_85" },
    "SA_102": { id: "SA_86" },
    "SA_103": { id: "SA_87" },
    "SA_104": { id: "SA_88" },
    "SA_105": { id: "SA_89" },
    "SA_106": { id: "SA_90" },
    "SA_107": { id: "SA_91" },
    "SA_108": { id: "SA_92" },
    "SA_109": { id: "SA_93" },
    "SA_110": { id: "SA_94" },
    "SA_111": { id: "SA_95" },
    "SA_112": { id: "SA_96" },
    "SA_113": { id: "SA_97" },
    "SA_114": { id: "SA_98" },
    "SA_115": { id: "SA_99" },
    "SA_116": { id: "SA_100" },
    "SA_117": { id: "SA_101" },
    "SA_118": { id: "SA_102" },
    "SA_119": { id: "SA_103" },
    "SA_120": { id: "SA_104" },
    "SA_121": { id: "SA_105" },
    "SA_122": { id: "SA_106" },
    "SA_123": { id: "SA_107" },
    "SA_124": { id: "SA_108" },
    "SA_125": { id: "SA_109" },
    "SA_126": { id: "SA_110" },
    "SA_127": { id: "SA_111" },
    "SA_128": { id: "SA_112" },
    "SA_129": { id: "SA_113" },
    "SA_130": { id: "SA_114" },
    "SA_131": { id: "SA_115" },
    "SA_132": { id: "SA_116" },
    "SA_133": { id: "SA_117" },
    "SA_134": { id: "SA_118" },
    "SA_135": { id: "SA_119" },
    "SA_136": { id: "SA_120" },
    "SA_137": { id: "SA_121" },
    "SA_138": { id: "SA_122" },
    "SA_139": { id: "SA_123" },
    "SA_140": { id: "SA_124" },
    "SA_141": { id: "SA_125" },
    "SA_142": { id: "SA_126" },
    "SA_143": { id: "SA_127" },
    "SA_144": { id: "SA_128" },
    "SA_145": { id: "SA_129" },
    "SA_146": { id: "SA_130" },
    "SA_147": { id: "SA_131" },
    "SA_148": { id: "SA_132" },
    "SA_149": { id: "SA_133" },
    "SA_150": { id: "SA_134" },
    "SA_151": { id: "SA_135" },
    "SA_152": { id: "SA_136" },
    "SA_153": { id: "SA_137" },
    "SA_154": { id: "SA_138" },
    "SA_155": { id: "SA_139" },
    "SA_156": { id: "SA_140" },
    "SA_157": { id: "SA_141" },
    "SA_158": { id: "SA_142" },
    "SA_159": { id: "SA_143" },
    "SA_160": { id: "SA_144" },
    "SA_161": { id: "SA_145" },
    "SA_162": { id: "SA_146" },
    "SA_163": { id: "SA_147" },
    "SA_164": { id: "SA_148" },
    "SA_165": { id: "SA_149" },
    "SA_166": { id: "SA_150" },
    "SA_167": { id: "SA_151" },
    "SA_168": { id: "SA_152", tier: 1 },
    "SA_169": { id: "SA_152", tier: 2 },
    "SA_170": { id: "SA_153" },
    "SA_171": { id: "SA_154" },
    "SA_172": { id: "SA_155" },
    "SA_173": { id: "SA_156" },
    "SA_174": { id: "SA_157", tier: 1 },
    "SA_175": { id: "SA_157", tier: 2 },
    "SA_176": { id: "SA_158", tier: 1 },
    "SA_177": { id: "SA_158", tier: 2 },
    "SA_178": { id: "SA_159" },
    "SA_179": { id: "SA_160" },
    "SA_180": { id: "SA_161" },
    "SA_181": { id: "SA_162" },
    "SA_182": { id: "SA_163" },
    "SA_183": { id: "SA_164" },
    "SA_184": { id: "SA_165" },
    "SA_185": { id: "SA_166" },
    "SA_186": { id: "SA_167" },
    "SA_187": { id: "SA_168" },
    "SA_188": { id: "SA_169" },
    "SA_189": { id: "SA_170", tier: 1 },
    "SA_190": { id: "SA_170", tier: 2 },
    "SA_191": { id: "SA_171" },
    "SA_192": { id: "SA_172", tier: 1 },
    "SA_193": { id: "SA_172", tier: 2 },
    "SA_194": { id: "SA_173" },
    "SA_195": { id: "SA_174" },
    "SA_196": { id: "SA_175" },
    "SA_197": { id: "SA_176" },
    "SA_198": { id: "SA_177" },
    "SA_199": { id: "SA_178" },
    "SA_200": { id: "SA_179" },
    "SA_201": { id: "SA_180" },
    "SA_202": { id: "SA_181" },
    "SA_203": { id: "SA_182" },
    "SA_204": { id: "SA_183" },
    "SA_205": { id: "SA_184" },
    "SA_206": { id: "SA_185" },
    "SA_207": { id: "SA_186" },
    "SA_208": { id: "SA_187" },
    "SA_209": { id: "SA_188" },
    "SA_210": { id: "SA_189" },
    "SA_211": { id: "SA_190" },
    "SA_212": { id: "SA_191" },
    "SA_213": { id: "SA_192" },
    "SA_214": { id: "SA_193" },
    "SA_215": { id: "SA_194" },
    "SA_216": { id: "SA_195" },
    "SA_217": { id: "SA_196" },
    "SA_218": { id: "SA_197" },
    "SA_219": { id: "SA_198" },
    "SA_220": { id: "SA_199" },
    "SA_221": { id: "SA_200" },
    "SA_222": { id: "SA_201" },
    "SA_223": { id: "SA_202" },
    "SA_224": { id: "SA_203" },
    "SA_225": { id: "SA_204" },
    "SA_226": { id: "SA_205" },
    "SA_227": { id: "SA_206" },
    "SA_228": { id: "SA_207" },
    "SA_229": { id: "SA_208" },
    "SA_230": { id: "SA_209" },
    "SA_231": { id: "SA_210" },
    "SA_232": { id: "SA_211" },
    "SA_233": { id: "SA_212" },
    "SA_234": { id: "SA_213" },
    "SA_235": { id: "SA_214" },
    "SA_236": { id: "SA_215" },
    "SA_237": { id: "SA_216" },
    "SA_238": { id: "SA_217" },
    "SA_239": { id: "SA_218" },
    "SA_240": { id: "SA_219" },
    "SA_241": { id: "SA_220" },
    "SA_242": { id: "SA_221" },
    "SA_243": { id: "SA_222" },
    "SA_244": { id: "SA_223" },
    "SA_245": { id: "SA_224" },
    "SA_246": { id: "SA_225" },
    "SA_247": { id: "SA_226" },
    "SA_248": { id: "SA_227" },
    "SA_249": { id: "SA_228" },
    "SA_250": { id: "SA_229" },
    "SA_251": { id: "SA_230" },
    "SA_252": { id: "SA_231" },
    "SA_253": { id: "SA_232" },
    "SA_254": { id: "SA_233" },
    "SA_255": { id: "SA_234" },
    "SA_256": { id: "SA_235" },
    "SA_257": { id: "SA_236" },
    "SA_258": { id: "SA_237" },
    "SA_259": { id: "SA_238" },
    "SA_260": { id: "SA_239" },
    "SA_261": { id: "SA_240", tier: 1 },
    "SA_262": { id: "SA_240", tier: 2 },
    "SA_263": { id: "SA_240", tier: 3 },
    "SA_264": { id: "SA_241" },
    "SA_265": { id: "SA_242" },
    "SA_266": { id: "SA_243" },
    "SA_267": { id: "SA_244" },
    "SA_268": { id: "SA_245" },
    "SA_269": { id: "SA_246" },
    "SA_270": { id: "SA_247" },
    "SA_271": { id: "SA_248" },
    "SA_272": { id: "SA_249" },
    "SA_273": { id: "SA_250" },
    "SA_274": { id: "SA_251" },
    "SA_275": { id: "SA_252" },
    "SA_276": { id: "SA_253" },
    "SA_277": { id: "SA_254", tier: 1 },
    "SA_278": { id: "SA_254", tier: 2 },
    "SA_279": { id: "SA_255" },
    "SA_280": { id: "SA_256" },
    "SA_281": { id: "SA_257" },
    "SA_282": { id: "SA_258", tier: 1 },
    "SA_283": { id: "SA_258", tier: 2 },
    "SA_284": { id: "SA_258", tier: 3 },
    "SA_285": { id: "SA_259" },
    "SA_286": { id: "SA_260" },
    "SA_287": { id: "SA_261" },
    "SA_288": { id: "SA_262" },
    "SA_289": { id: "SA_263" },
    "SA_290": { id: "SA_264", tier: 1 },
    "SA_291": { id: "SA_264", tier: 2 },
    "SA_292": { id: "SA_265" },
    "SA_293": { id: "SA_266" },
    "SA_294": { id: "SA_267" },
    "SA_295": { id: "SA_268" },
    "SA_296": { id: "SA_269" },
    "SA_297": { id: "SA_270" },
    "SA_298": { id: "SA_271" },
    "SA_299": { id: "SA_272" },
    "SA_300": { id: "SA_273" },
    "SA_301": { id: "SA_274" },
    "SA_302": { id: "SA_275" },
    "SA_303": { id: "SA_276" },
    "SA_304": { id: "SA_277" },
    "SA_305": { id: "SA_278" },
    "SA_306": { id: "SA_279" },
    "SA_307": { id: "SA_280" },
    "SA_308": { id: "SA_281" },
    "SA_309": { id: "SA_282" },
    "SA_310": { id: "SA_283" },
    "SA_311": { id: "SA_284" },
    "SA_312": { id: "SA_285" },
    "SA_313": { id: "SA_286" },
    "SA_314": { id: "SA_287" },
    "SA_315": { id: "SA_288" },
    "SA_316": { id: "SA_289" },
    "SA_317": { id: "SA_290" },
    "SA_318": { id: "SA_291" },
    "SA_319": { id: "SA_292" },
    "SA_320": { id: "SA_293" },
    "SA_321": { id: "SA_294" },
    "SA_322": { id: "SA_295" },
    "SA_323": { id: "SA_296" },
    "SA_324": { id: "SA_297" },
    "SA_325": { id: "SA_298" },
    "SA_326": { id: "SA_299" },
    "SA_327": { id: "SA_300" },
    "SA_328": { id: "SA_301" },
    "SA_329": { id: "SA_302" },
    "SA_330": { id: "SA_303" },
    "SA_331": { id: "SA_304" },
    "SA_332": { id: "SA_305" },
    "SA_333": { id: "SA_306" },
    "SA_334": { id: "SA_307" },
    "SA_335": { id: "SA_308" },
    "SA_336": { id: "SA_309" },
    "SA_337": { id: "SA_310" },
    "SA_338": { id: "SA_311" },
    "SA_339": { id: "SA_312" },
    "SA_340": { id: "SA_313" },
    "SA_341": { id: "SA_314" },
    "SA_342": { id: "SA_315" },
    "SA_343": { id: "SA_316" },
    "SA_344": { id: "SA_317" },
    "SA_345": { id: "SA_318" },
    "SA_346": { id: "SA_319" },
    "SA_347": { id: "SA_320" },
    "SA_348": { id: "SA_321" },
    "SA_349": { id: "SA_322" },
    "SA_350": { id: "SA_323" },
    "SA_351": { id: "SA_324" },
    "SA_352": { id: "SA_325" },
    "SA_353": { id: "SA_326" },
    "SA_354": { id: "SA_327" },
    "SA_355": { id: "SA_328", tier: 1 },
    "SA_356": { id: "SA_328", tier: 2 },
    "SA_357": { id: "SA_328", tier: 3 },
    "SA_358": { id: "SA_328", tier: 4 },
    "SA_359": { id: "SA_329" },
    "SA_360": { id: "SA_330" },
    "SA_361": { id: "SA_331" },
    "SA_362": { id: "SA_332" },
    "SA_363": { id: "SA_333" },
    "SA_364": { id: "SA_334" },
    "SA_365": { id: "SA_335" },
    "SA_366": { id: "SA_336" },
    "SA_367": { id: "SA_337" },
    "SA_368": { id: "SA_338" },
    "SA_369": { id: "SA_339", tier: 1 },
    "SA_370": { id: "SA_339", tier: 2 },
    "SA_371": { id: "SA_339", tier: 3 },
    "SA_372": { id: "SA_339", tier: 4 },
    "SA_373": { id: "SA_339", tier: 5 },
    "SA_374": { id: "SA_340" },
    "SA_375": { id: "SA_341" },
    "SA_376": { id: "SA_342" },
    "SA_377": { id: "SA_343" },
    "SA_378": { id: "SA_344" },
    "SA_379": { id: "SA_345" },
    "SA_380": { id: "SA_346" },
    "SA_381": { id: "SA_347" },
    "SA_382": { id: "SA_348", sid: 1 },
    "SA_383": { id: "SA_348", sid: 2 },
    "SA_384": { id: "SA_348", sid: 3 },
    "SA_385": { id: "SA_348", sid: 4 },
    "SA_386": { id: "SA_348", sid: 5 },
    "SA_387": { id: "SA_348", sid: 6 },
    "SA_388": { id: "SA_348", sid: 7 },
    "SA_389": { id: "SA_348", sid: 8 },
    "SA_390": { id: "SA_349", tier: 1 },
    "SA_391": { id: "SA_349", tier: 2 },
    "SA_392": { id: "SA_349", tier: 3 },
    "SA_393": { id: "SA_349", tier: 4 },
    "SA_394": { id: "SA_350" },
    "SA_395": { id: "SA_351", tier: 1 },
    "SA_396": { id: "SA_351", tier: 2 },
    "SA_397": { id: "SA_351", tier: 3 },
    "SA_398": { id: "SA_351", tier: 4 },
    "SA_399": { id: "SA_351", tier: 5 },
    "SA_400": { id: "SA_352" },
    "SA_401": { id: "SA_353" },
    "SA_402": { id: "SA_354" },
    "SA_403": { id: "SA_355" },
    "SA_404": { id: "SA_356" },
    "SA_405": { id: "SA_357" },
    "SA_406": { id: "SA_358" },
    "SA_407": { id: "SA_359" },
    "SA_408": { id: "SA_360" },
    "SA_409": { id: "SA_361" },
    "SA_410": { id: "SA_362" },
    "SA_411": { id: "SA_363" },
    "SA_412": { id: "SA_364" },
    "SA_413": { id: "SA_365", tier: 1 },
    "SA_414": { id: "SA_365", tier: 2 },
    "SA_415": { id: "SA_365", tier: 3 },
    "SA_416": { id: "SA_365", tier: 4 },
    "SA_417": { id: "SA_366" },
    "SA_418": { id: "SA_367" },
    "SA_419": { id: "SA_368" },
    "SA_420": { id: "SA_369", tier: 1 },
    "SA_421": { id: "SA_369", tier: 2 },
    "SA_422": { id: "SA_369", tier: 3 },
    "SA_423": { id: "SA_369", tier: 4 },
    "SA_424": { id: "SA_369", tier: 5 },
    "SA_425": { id: "SA_370" },
    "SA_426": { id: "SA_371" },
    "SA_427": { id: "SA_372" },
    "SA_428": { id: "SA_373" },
    "SA_429": { id: "SA_374" },
    "SA_430": { id: "SA_375" },
    "SA_431": { id: "SA_376" },
    "SA_432": { id: "SA_377" },
    "SA_433": { id: "SA_378" },
    "SA_434": { id: "SA_379" },
    "SA_435": { id: "SA_380" },
    "SA_436": { id: "SA_381" },
    "SA_437": { id: "SA_382" },
    "SA_438": { id: "SA_383" },
    "SA_439": { id: "SA_384" },
    "SA_440": { id: "SA_385", tier: 1 },
    "SA_441": { id: "SA_385", tier: 2 },
    "SA_442": { id: "SA_385", tier: 3 },
    "SA_443": { id: "SA_385", tier: 4 },
    "SA_444": { id: "SA_386" },
    "SA_445": { id: "SA_387", tier: 1 },
    "SA_446": { id: "SA_387", tier: 2 },
    "SA_447": { id: "SA_388" },
    "SA_448": { id: "SA_389", tier: 1 },
    "SA_449": { id: "SA_389", tier: 2 },
    "SA_450": { id: "SA_389", tier: 3 },
    "SA_451": { id: "SA_389", tier: 4 },
    "SA_452": { id: "SA_389", tier: 5 },
    "SA_453": { id: "SA_390" },
    "SA_454": { id: "SA_391" },
    "SA_455": { id: "SA_392" },
    "SA_456": { id: "SA_393" },
    "SA_457": { id: "SA_394" },
    "SA_458": { id: "SA_395" },
    "SA_459": { id: "SA_396" },
    "SA_460": { id: "SA_397" },
    "SA_461": { id: "SA_398" },
    "SA_462": { id: "SA_399" },
    "SA_463": { id: "SA_400", tier: 1 },
    "SA_464": { id: "SA_400", tier: 2 },
    "SA_465": { id: "SA_400", tier: 3 },
    "SA_466": { id: "SA_400", tier: 4 },
    "SA_467": { id: "SA_401" },
    "SA_468": { id: "SA_402" },
    "SA_469": { id: "SA_403" },
    "SA_470": { id: "SA_404", tier: 1 },
    "SA_471": { id: "SA_404", tier: 2 },
    "SA_472": { id: "SA_404", tier: 3 },
    "SA_473": { id: "SA_404", tier: 4 },
    "SA_474": { id: "SA_404", tier: 5 },
    "SA_475": { id: "SA_405" },
    "SA_476": { id: "SA_406" },
    "SA_477": { id: "SA_407" },
    "SA_478": { id: "SA_408" },
    "SA_479": { id: "SA_409" },
    "SA_480": { id: "SA_410" },
    "SA_481": { id: "SA_411" },
    "SA_482": { id: "SA_412" },
    "SA_483": { id: "SA_413" },
    "SA_484": { id: "SA_414" },
    "SA_485": { id: "SA_415" },
    "SA_486": { id: "SA_416" },
    "SA_487": { id: "SA_417" },
    "SA_488": { id: "SA_418" },
    "SA_489": { id: "SA_419" },
    "SA_490": { id: "SA_420" },
    "SA_491": { id: "SA_421" },
    "SA_492": { id: "SA_422" },
    "SA_493": { id: "SA_423" },
    "SA_494": { id: "SA_424" },
    "SA_495": { id: "SA_425" },
    "SA_496": { id: "SA_426" },
    "SA_497": { id: "SA_427" },
    "SA_498": { id: "SA_428" },
    "SA_499": { id: "SA_429" },
    "SA_500": { id: "SA_430" },
    "SA_501": { id: "SA_431" },
  }

  const updateObjects = (list: RawActiveObject[], sid?: string | number, tier?: number) =>
    [...list].map (e => ({
      ...e,
      sid: sid === undefined ? e.sid : sid,
      tier: tier === undefined || (typeof e.tier === "number" && e.tier > tier) ? e.tier : tier,
    }))

  for (const [id, activeObjects] of Object.entries (entry.activatable)) {
    if (convertIds[id] === undefined) {
      // @ts-ignore
      newActivatable[id] = activeObjects
    }
    else {
      const { id: newId, sid, tier } = convertIds[id]
      // @ts-ignore
      newActivatable[newId] =
        updateObjects (
          newActivatable[newId] === undefined ? activeObjects : newActivatable[newId],
          sid,
          tier
        )
    }
  }

  entry.activatable = newActivatable

  for (const [id, item] of Object.entries (entry.belongings.items)) {
    // @ts-ignore
    entry.belongings.items[id] = {
      ...item,
      // @ts-ignore
      damageBonus: { value: item.damageBonus as number },
    }
  }

  entry.clientVersion = "0.49.5"

  return entry
}

// tslint:disable-next-line:variable-name
const convertLowerThanOrEqual0_51_0 = (hero: RawHero): RawHero => {
  const entry = { ...hero }

  const oldRaceId = entry.r

  switch (oldRaceId) {
    case "R_1":
      entry.r = "R_1"
      entry.rv = "RV_1"
      break
    case "R_2":
      entry.r = "R_1"
      entry.rv = "RV_2"
      break
    case "R_3":
      entry.r = "R_1"
      entry.rv = "RV_3"
      break
    case "R_4":
      entry.r = "R_1"
      entry.rv = "RV_4"
      break
    case "R_5":
      entry.r = "R_1"
      entry.rv = "RV_5"
      break
    case "R_6":
      entry.r = "R_1"
      entry.rv = "RV_6"
      break
    case "R_7":
      entry.r = "R_1"
      entry.rv = "RV_7"
      break
    case "R_8":
      entry.r = "R_2"
      entry.rv = "RV_1"
      break
    case "R_9":
      entry.r = "R_2"
      entry.rv = "RV_2"
      break
    case "R_10":
      entry.r = "R_2"
      entry.rv = "RV_3"
      break
    case "R_11":
      entry.r = "R_3"
      break
    case "R_12":
      entry.r = "R_4"
      break
    default:
      break
  }

  entry.rules = {
    ...entry.rules,
    enableAllRuleBooks: true,
    enabledRuleBooks: [],
  }

  entry.clientVersion = "0.51.1"

  return entry
}

// tslint:disable-next-line:variable-name
const convertLowerThanOrEqual0_51_2 = (hero: RawHero): RawHero => {
  const entry = { ...hero }

  if (hasOwnProperty ("SA_243") (entry.activatable)
      && hasOwnProperty ("SA_255") (entry.activatable)) {
    const { SA_255: _, ...other } = entry.activatable
    entry.activatable = other
    // @ts-ignore
    entry.ap.spent -= 10
  }
  else if (hasOwnProperty ("SA_255") (entry.activatable)) {
    const { SA_255: arr, ...other } = entry.activatable
    entry.activatable = {
      ...other,
      SA_243: arr,
    }
  }

  entry.clientVersion = "0.51.3"

  return entry
}

// tslint:disable-next-line:variable-name
const convertLowerThanOrEqual0_51_3 = (hero: RawHero): RawHero => {
  const entry = { ...hero }

  if (hasOwnProperty ("SA_344") (entry.activatable)) {
    entry.activatable = {
      ...entry.activatable,
      SA_344: [{ sid: "CT_3" }],
    }
  }

  if (hasOwnProperty ("SA_345") (entry.activatable)) {
    const { SA_344: arr, ...other } = entry.activatable
    if (Array.isArray (arr)) {
      entry.activatable = {
        ...other,
        SA_344: [...arr, { sid: "CT_12" }],
      }
    }
    else {
      entry.activatable = {
        ...other,
        SA_344: [{ sid: "CT_12" }],
      }
    }
  }

  if (hasOwnProperty ("SA_346") (entry.activatable)) {
    const { SA_344: arr, ...other } = entry.activatable
    if (Array.isArray (arr)) {
      entry.activatable = {
        ...other,
        SA_344: [...arr, { sid: "CT_16" }],
      }
    }
    else {
      entry.activatable = {
        ...other,
        SA_344: [{ sid: "CT_16" }],
      }
    }
  }

  if (hasOwnProperty ("SA_70") (entry.activatable)) {
    const { SA_70: arr, ...other } = entry.activatable
    entry.activatable = other
    for (const active of arr) {
      const { sid, sid2 } = active
      const id = getMagicalTraditionInstanceIdByNumericId (sid as number)
      // @ts-ignore
      entry.activatable[fromMaybe ("SA_70") (id)] = [{ sid: sid2 }]
    }
  }

  if (hasOwnProperty ("SA_86") (entry.activatable)) {
    const { SA_86: arr, ...other } = entry.activatable
    entry.activatable = other
    for (const active of arr) {
      const { sid, sid2 } = active
      const id = getBlessedTradStrIdFromNumId (sid as number)
      // @ts-ignore
      entry.activatable[fromMaybe ("SA_86") (id)] = [{ sid: sid2 }]
    }
  }

  if (hasOwnProperty ("DISADV_34") (entry.activatable)) {
    entry.activatable = {
      ...entry.activatable,
      DISADV_34: entry.activatable.DISADV_34.map (e => {
        switch (e.sid) {
          case 5:
            return { sid: 1, tier: 2 }
          case 6:
            return { sid: 5, tier: 2 }
          case 7:
            return { sid: 6, tier: 2 }
          case 8:
            return { sid: 7, tier: 2 }
          case 9:
            return { sid: 8, tier: 2 }
          case 10:
            return { sid: 9, tier: 2 }
          case 11:
            return { sid: 10, tier: 2 }
          case 12:
            return { sid: 11, tier: 2 }
          case 13:
            return { sid: 1, tier: 3 }
          case 14:
            return { sid: 12, tier: 3 }
          default:
            return e
        }
      }),
    }
  }

  entry.clientVersion = "0.51.4"

  return entry
}

// tslint:disable-next-line:variable-name
const convertLowerThan1_0_0 = (hero: RawHero): RawHero => {
  const entry = { ...hero }

  if (
    hasOwnProperty ("DISADV_45") (entry.activatable)
    && entry.activatable.DISADV_45.some (e => e.sid === 1)
  ) {
    entry.pers.haircolor = 24
    entry.pers.eyecolor = 19
  }

  return entry
}

// tslint:disable-next-line:variable-name
const convertLowerThan1_0_2 = (hero: RawHero): RawHero => {
  const entry = { ...hero }

  let adjValue = 0

  if (entry.r === "R_1" || entry.r === "R_3") {
    adjValue = 1
  }
  else if (entry.r === "R_2") {
    adjValue = -2
  }
  else if (entry.r === "R_4") {
    adjValue = -2
  }

  // @ts-ignore
  let index = entry.attr.values.findIndex (e => e[2] === adjValue)

  if (index === -1) {
    // @ts-ignore
    index = entry.attr.values.findIndex (e => e[2] !== 0)
  }

  // @ts-ignore
  entry.attr.values = entry.attr.values.map ((e, i) => {
    // @ts-ignore
    const inter = [...e] as [string, number, number]
    inter[2] = i === index ? adjValue : 0

    return inter
  })

  return entry
}

// tslint:disable-next-line:variable-name
const convertLowerThan1_1_0_Alpha_1 = (hero: RawHero): RawHero =>
  ({
    ...hero,
    attr: {
      ...hero.attr,
      // @ts-ignore
      values: hero .attr .values .map (e => ({ id: e[0], value: e[1] })),
      attributeAdjustmentSelected: ["R_1", "R_3"] .includes (hero .r!)
        ? hero .attr .values .reduce (
          // @ts-ignore
          (acc, e) => e[2] === 1 ? e[0] : acc,
          "ATTR_1"
        )
        : hero .r === "R_2"
        ? hero .attr .values .reduce (
          // @ts-ignore
          (acc, e) => e[0] === "ATTR_2" && e[2] === 1 ? e[0] : acc,
          "ATTR_8"
        )
        : hero .attr .values .reduce (
          // @ts-ignore
          (acc, e) => e[0] === "ATTR_4" && e[2] === 1 ? e[0] : acc,
          "ATTR_6"
        ),
    },
    // ct: Object.entries (hero.ct)
    //   .reduce<StringKeyObject<number>> ((acc, e) => ({ ...acc, [e[0]]: e[1] - 6 }), {}),
  })

export const convertHero =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (orig_hero: RawHero): RawHero => {
    let entry = { ...orig_hero }

    if (lt (entry.clientVersion, "0.49.5")) {
      entry = convertLowerThan0_49_5 (entry)
    }

    if (
      lte (entry.clientVersion.split (/-/u)[0], "0.51.0")
      || entry.clientVersion === "0.51.1-alpha.1"
    ) {
      entry = convertLowerThanOrEqual0_51_0 (entry)
    }

    if (satisfies (entry.clientVersion.split (/-/u)[0], "<= 0.51.2 || <= 0.51.3-alpha.3")) {
      entry = convertLowerThanOrEqual0_51_2 (entry)
    }

    if (satisfies (entry.clientVersion, "<= 0.51.3 || < 0.51.4-alpha.6")) {
      entry = convertLowerThanOrEqual0_51_3 (entry)
    }

    return pipe_ (
      entry,
      convertLT ("1.0.0") (convertLowerThan1_0_0),
      convertLT ("1.0.2") (convertLowerThan1_0_2),
      convertLT ("1.1.0-alpha.1") (convertLowerThan1_1_0_Alpha_1),
      convertLT ("1.1.0-alpha.9")
                (hero => ({
                  ...hero,
                  locale: L10n.A.id (l10n),
                  belongings: {
                    ...hero.belongings,
                    items: pipe_ (
                      hero.belongings.items,
                      Object.entries,
                      (xs: [string, RawCustomItem][]) => xs .map<[string, RawCustomItem]> (
                        x => [
                          x[0],
                          {
                            ...x[1],
                            reloadTime:
                              isNumber (x[1].reloadTime)
                                ? (x[1].reloadTime as number).toString ()
                                : x[1].reloadTime,
                            stp:
                              isNumber (x[1].stp)
                                ? (x[1].stp as number).toString ()
                                : x[1].stp,
                          },
                        ]
                      ),
                      fromEntries
                    ),
                  },
                })),
      convertLT ("1.1.0-alpha.18")
                (hero => hero.activatable.DISADV_48 === undefined
                  ? hero
                  : ({
                      ...hero,
                      activatable: {
                        ...hero.activatable,
                        DISADV_48:
                          hero.activatable.DISADV_48
                            .filter (activeObj => typeof activeObj .sid === "string"
                                                  && /^TAL_/u .test (activeObj .sid)),
                      },
                    })),
      convertLT ("1.1.0-alpha.20")
                (hero => {
                  let activatable = { ...hero.activatable }

                  const editBase = (base: string) => {
                    if (activatable [base] !== undefined && activatable [base] .length === 1) {
                      activatable = {
                        ...activatable,
                        [base]: [{ sid: 1 }],
                      }
                    }
                  }

                  const editOther = (base: string) => (id: string) => (sid: number) => {
                    if (activatable [id] !== undefined && activatable [id] .length === 1) {
                      activatable = {
                        ...activatable,
                        [base]: activatable [base] === undefined
                          ? [{ sid }]
                          : [...activatable [base], { sid }],
                      }
                    }
                  }

                  editBase ("ADV_18")
                  editOther ("ADV_18") ("ADV_19") (2)
                  editOther ("ADV_18") ("ADV_20") (3)
                  editOther ("ADV_18") ("ADV_21") (4)

                  editBase ("DISADV_7")
                  editOther ("DISADV_7") ("DISADV_8") (2)
                  editOther ("DISADV_7") ("DISADV_9") (3)
                  editOther ("DISADV_7") ("DISADV_10") (4)

                  return ({
                    ...hero,
                    activatable,
                  })
                }),
      convertLT ("1.2.0-alpha.6")
                (hero => pipe_ (
                  // Try to infer if player used cultural package
                  // To check that, we compare all skills of the cultural package
                  // if the actual SRs from the character are at least as high
                  // as the bonus from the package is
                  Maybe (hero .c),
                  bindF (lookupF (WA.cultures (wiki))),
                  maybe_ (() => ({
                           ...hero,
                           isCulturalPackageActive: false,
                         }))
                         (pipe (
                           Culture.A.culturalPackageSkills,
                           all (skill => hero .talents [IncreaseSkill.A.id (skill)]
                                         >= IncreaseSkill.A.value (skill)),
                           isCulturalPackageActive => ({
                             ...hero,
                             isCulturalPackageActive,
                           })
                         ))
                ))
    )
  }

const fromEntries =
  <A> (xs: [string, A][]): { [key: string]: A } => {
    const obj: { [key: string]: A } = {}

    xs.forEach (x => {
      obj [x[0]] = x[1]
    })

    return obj
  }

const convertLT =
  (lower_than_version: string) =>
  (f: ident<RawHero>) =>
  (hero: RawHero): RawHero =>
    lt (hero.clientVersion, lower_than_version)
      ? { ...(f (hero)), clientVersion: lower_than_version }
      : hero

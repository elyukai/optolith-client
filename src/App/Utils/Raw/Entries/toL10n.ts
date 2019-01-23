import { fromRight_, isLeft, mapM, maybeToEither } from "../../../../Data/Either";
import { List } from "../../../../Data/List";
import { liftM2 } from "../../../../Data/Maybe";
import { fromList, lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { fromBoth, Pair } from "../../../../Data/Pair";
import { L10n } from "../../../Models/Wiki/L10n";
import { mensureMapNonEmptyString, mensureMapNonEmptyStringList, mensureMapStringPred } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed } from "../validateValueUtils";

const localeRx = /[a-z]{2}-[A-Z]{2}/

const isLocale =
  (x: string) => localeRx .test (x)

export const toL10n =
  ((l10n_table: List<OrderedMap<string, string>>) => {
      // Shortcuts

      const l10n_rows =
        mapM<string, OrderedMap<string, string>, Pair<string, string>>
          ((row: OrderedMap<string, string>) =>
            maybeToEither
              ("Cell missing.")
              (liftM2<string, string, Pair<string, string>> (fromBoth)
                                                            (lookupF (row) ("key"))
                                                            (lookupF (row) ("value"))))
          (l10n_table)

      if (isLeft (l10n_rows)) {
        return l10n_rows
      }

      const l10n_map = fromList (fromRight_ (l10n_rows))

      const lookup_l10n = lookupF (l10n_map)

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkL10nLocaleString =
        lookupKeyValid (mensureMapStringPred (isLocale) ("Locale")) (lookup_l10n)

      const checkL10nNonEmptyStringList =
        lookupKeyValid (mensureMapNonEmptyStringList ("&&")) (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          "id":
            checkL10nLocaleString ("id"),
          "titlebar.tabs.home":
            checkL10nNonEmptyString ("titlebar.tabs.home"),
          "titlebar.tabs.homeintro":
            checkL10nNonEmptyString ("titlebar.tabs.homeintro"),
          "titlebar.tabs.news":
            checkL10nNonEmptyString ("titlebar.tabs.news"),
          "titlebar.tabs.lastchanges":
            checkL10nNonEmptyString ("titlebar.tabs.lastchanges"),
          "titlebar.tabs.heroes":
            checkL10nNonEmptyString ("titlebar.tabs.heroes"),
          "titlebar.tabs.groups":
            checkL10nNonEmptyString ("titlebar.tabs.groups"),
          "titlebar.tabs.customrules":
            checkL10nNonEmptyString ("titlebar.tabs.customrules"),
          "titlebar.tabs.wiki":
            checkL10nNonEmptyString ("titlebar.tabs.wiki"),
          "titlebar.tabs.faq":
            checkL10nNonEmptyString ("titlebar.tabs.faq"),
          "titlebar.tabs.about":
            checkL10nNonEmptyString ("titlebar.tabs.about"),
          "titlebar.tabs.imprint":
            checkL10nNonEmptyString ("titlebar.tabs.imprint"),
          "titlebar.tabs.thirdpartylicenses":
            checkL10nNonEmptyString ("titlebar.tabs.thirdpartylicenses"),
          "titlebar.tabs.profile":
            checkL10nNonEmptyString ("titlebar.tabs.profile"),
          "titlebar.tabs.profileoverview":
            checkL10nNonEmptyString ("titlebar.tabs.profileoverview"),
          "titlebar.tabs.personaldata":
            checkL10nNonEmptyString ("titlebar.tabs.personaldata"),
          "titlebar.tabs.charactersheet":
            checkL10nNonEmptyString ("titlebar.tabs.charactersheet"),
          "titlebar.tabs.pact":
            checkL10nNonEmptyString ("titlebar.tabs.pact"),
          "titlebar.tabs.rules":
            checkL10nNonEmptyString ("titlebar.tabs.rules"),
          "titlebar.tabs.racecultureprofession":
            checkL10nNonEmptyString ("titlebar.tabs.racecultureprofession"),
          "titlebar.tabs.race":
            checkL10nNonEmptyString ("titlebar.tabs.race"),
          "titlebar.tabs.culture":
            checkL10nNonEmptyString ("titlebar.tabs.culture"),
          "titlebar.tabs.profession":
            checkL10nNonEmptyString ("titlebar.tabs.profession"),
          "titlebar.tabs.attributes":
            checkL10nNonEmptyString ("titlebar.tabs.attributes"),
          "titlebar.tabs.advantagesdisadvantages":
            checkL10nNonEmptyString ("titlebar.tabs.advantagesdisadvantages"),
          "titlebar.tabs.advantages":
            checkL10nNonEmptyString ("titlebar.tabs.advantages"),
          "titlebar.tabs.disadvantages":
            checkL10nNonEmptyString ("titlebar.tabs.disadvantages"),
          "titlebar.tabs.skills":
            checkL10nNonEmptyString ("titlebar.tabs.skills"),
          "titlebar.tabs.talents":
            checkL10nNonEmptyString ("titlebar.tabs.talents"),
          "titlebar.tabs.combattechniques":
            checkL10nNonEmptyString ("titlebar.tabs.combattechniques"),
          "titlebar.tabs.specialabilities":
            checkL10nNonEmptyString ("titlebar.tabs.specialabilities"),
          "titlebar.tabs.spells":
            checkL10nNonEmptyString ("titlebar.tabs.spells"),
          "titlebar.tabs.liturgies":
            checkL10nNonEmptyString ("titlebar.tabs.liturgies"),
          "titlebar.tabs.belongings":
            checkL10nNonEmptyString ("titlebar.tabs.belongings"),
          "titlebar.tabs.equipment":
            checkL10nNonEmptyString ("titlebar.tabs.equipment"),
          "titlebar.tabs.zonearmor":
            checkL10nNonEmptyString ("titlebar.tabs.zonearmor"),
          "titlebar.tabs.pets":
            checkL10nNonEmptyString ("titlebar.tabs.pets"),
          "titlebar.actions.login":
            checkL10nNonEmptyString ("titlebar.actions.login"),
          "titlebar.actions.logout":
            checkL10nNonEmptyString ("titlebar.actions.logout"),
          "titlebar.view.adventurepoints":
            checkL10nNonEmptyString ("titlebar.view.adventurepoints"),
          "titlebar.adventurepoints.title":
            checkL10nNonEmptyString ("titlebar.adventurepoints.title"),
          "titlebar.adventurepoints.total":
            checkL10nNonEmptyString ("titlebar.adventurepoints.total"),
          "titlebar.adventurepoints.spent":
            checkL10nNonEmptyString ("titlebar.adventurepoints.spent"),
          "titlebar.adventurepoints.advantages":
            checkL10nNonEmptyString ("titlebar.adventurepoints.advantages"),
          "titlebar.adventurepoints.advantagesmagic":
            checkL10nNonEmptyString ("titlebar.adventurepoints.advantagesmagic"),
          "titlebar.adventurepoints.advantagesblessed":
            checkL10nNonEmptyString ("titlebar.adventurepoints.advantagesblessed"),
          "titlebar.adventurepoints.disadvantages":
            checkL10nNonEmptyString ("titlebar.adventurepoints.disadvantages"),
          "titlebar.adventurepoints.disadvantagesmagic":
            checkL10nNonEmptyString ("titlebar.adventurepoints.disadvantagesmagic"),
          "titlebar.adventurepoints.disadvantagesblessed":
            checkL10nNonEmptyString ("titlebar.adventurepoints.disadvantagesblessed"),
          "titlebar.adventurepoints.race":
            checkL10nNonEmptyString ("titlebar.adventurepoints.race"),
          "titlebar.adventurepoints.profession":
            checkL10nNonEmptyString ("titlebar.adventurepoints.profession"),
          "titlebar.adventurepoints.attributes":
            checkL10nNonEmptyString ("titlebar.adventurepoints.attributes"),
          "titlebar.adventurepoints.skills":
            checkL10nNonEmptyString ("titlebar.adventurepoints.skills"),
          "titlebar.adventurepoints.combattechniques":
            checkL10nNonEmptyString ("titlebar.adventurepoints.combattechniques"),
          "titlebar.adventurepoints.spells":
            checkL10nNonEmptyString ("titlebar.adventurepoints.spells"),
          "titlebar.adventurepoints.cantrips":
            checkL10nNonEmptyString ("titlebar.adventurepoints.cantrips"),
          "titlebar.adventurepoints.liturgicalchants":
            checkL10nNonEmptyString ("titlebar.adventurepoints.liturgicalchants"),
          "titlebar.adventurepoints.blessings":
            checkL10nNonEmptyString ("titlebar.adventurepoints.blessings"),
          "titlebar.adventurepoints.specialabilities":
            checkL10nNonEmptyString ("titlebar.adventurepoints.specialabilities"),
          "titlebar.adventurepoints.energies":
            checkL10nNonEmptyString ("titlebar.adventurepoints.energies"),
          "options.filtertext":
            checkL10nNonEmptyString ("options.filtertext"),
          "options.sortorder.alphabetically":
            checkL10nNonEmptyString ("options.sortorder.alphabetically"),
          "options.sortorder.ap":
            checkL10nNonEmptyString ("options.sortorder.ap"),
          "options.sortorder.datemodified":
            checkL10nNonEmptyString ("options.sortorder.datemodified"),
          "options.sortorder.group":
            checkL10nNonEmptyString ("options.sortorder.group"),
          "options.sortorder.improvementcost":
            checkL10nNonEmptyString ("options.sortorder.improvementcost"),
          "options.sortorder.property":
            checkL10nNonEmptyString ("options.sortorder.property"),
          "options.sortorder.aspect":
            checkL10nNonEmptyString ("options.sortorder.aspect"),
          "options.sortorder.location":
            checkL10nNonEmptyString ("options.sortorder.location"),
          "options.sortorder.cost":
            checkL10nNonEmptyString ("options.sortorder.cost"),
          "options.sortorder.weight":
            checkL10nNonEmptyString ("options.sortorder.weight"),
          "options.showactivated":
            checkL10nNonEmptyString ("options.showactivated"),
          "options.none":
            checkL10nNonEmptyString ("options.none"),
          "actions.save":
            checkL10nNonEmptyString ("actions.save"),
          "actions.done":
            checkL10nNonEmptyString ("actions.done"),
          "actions.delete":
            checkL10nNonEmptyString ("actions.delete"),
          "yes":
            checkL10nNonEmptyString ("yes"),
          "no":
            checkL10nNonEmptyString ("no"),
          "ok":
            checkL10nNonEmptyString ("ok"),
          "cancel":
            checkL10nNonEmptyString ("cancel"),
          "copy":
            checkL10nNonEmptyString ("copy"),
          "homeintro.title":
            checkL10nNonEmptyString ("homeintro.title"),
          "homeintro.text":
            checkL10nNonEmptyString ("homeintro.text"),
          "heroes.actions.create":
            checkL10nNonEmptyString ("heroes.actions.create"),
          "heroes.actions.import":
            checkL10nNonEmptyString ("heroes.actions.import"),
          "heroes.options.filter.all":
            checkL10nNonEmptyString ("heroes.options.filter.all"),
          "heroes.options.filter.own":
            checkL10nNonEmptyString ("heroes.options.filter.own"),
          "heroes.options.filter.shared":
            checkL10nNonEmptyString ("heroes.options.filter.shared"),
          "heroes.view.unsavedhero.title":
            checkL10nNonEmptyString ("heroes.view.unsavedhero.title"),
          "heroes.warnings.unsavedactions.title":
            checkL10nNonEmptyString ("heroes.warnings.unsavedactions.title"),
          "heroes.warnings.unsavedactions.text":
            checkL10nNonEmptyString ("heroes.warnings.unsavedactions.text"),
          "heroes.warnings.delete.title":
            checkL10nNonEmptyString ("heroes.warnings.delete.title"),
          "heroes.warnings.delete.message":
            checkL10nNonEmptyString ("heroes.warnings.delete.message"),
          "herocreation.title":
            checkL10nNonEmptyString ("herocreation.title"),
          "herocreation.actions.start":
            checkL10nNonEmptyString ("herocreation.actions.start"),
          "herocreation.options.nameofhero":
            checkL10nNonEmptyString ("herocreation.options.nameofhero"),
          "herocreation.options.selectsex":
            checkL10nNonEmptyString ("herocreation.options.selectsex"),
          "herocreation.options.selectsex.male":
            checkL10nNonEmptyString ("herocreation.options.selectsex.male"),
          "herocreation.options.selectsex.female":
            checkL10nNonEmptyString ("herocreation.options.selectsex.female"),
          "herocreation.options.selectexperiencelevel":
            checkL10nNonEmptyString ("herocreation.options.selectexperiencelevel"),
          "wiki.category.magic":
            checkL10nNonEmptyString ("wiki.category.magic"),
          "wiki.category.spells":
            checkL10nNonEmptyString ("wiki.category.spells"),
          "wiki.category.rituals":
            checkL10nNonEmptyString ("wiki.category.rituals"),
          "wiki.category.cantrips":
            checkL10nNonEmptyString ("wiki.category.cantrips"),
          "wiki.category.curses":
            checkL10nNonEmptyString ("wiki.category.curses"),
          "wiki.category.elvenmagicalsongs":
            checkL10nNonEmptyString ("wiki.category.elvenmagicalsongs"),
          "wiki.category.magicalmelodies":
            checkL10nNonEmptyString ("wiki.category.magicalmelodies"),
          "wiki.category.magicaldances":
            checkL10nNonEmptyString ("wiki.category.magicaldances"),
          "imprint.title":
            checkL10nNonEmptyString ("imprint.title"),
          "imprint.emailhint":
            checkL10nNonEmptyString ("imprint.emailhint"),
          "profileoverview.view.male":
            checkL10nNonEmptyString ("profileoverview.view.male"),
          "profileoverview.view.female":
            checkL10nNonEmptyString ("profileoverview.view.female"),
          "profileoverview.view.editprofessionname":
            checkL10nNonEmptyString ("profileoverview.view.editprofessionname"),
          "profileoverview.view.personaldata":
            checkL10nNonEmptyString ("profileoverview.view.personaldata"),
          "profileoverview.view.advantages":
            checkL10nNonEmptyString ("profileoverview.view.advantages"),
          "profileoverview.view.disadvantages":
            checkL10nNonEmptyString ("profileoverview.view.disadvantages"),
          "profileoverview.actions.addadventurepoints":
            checkL10nNonEmptyString ("profileoverview.actions.addadventurepoints"),
          "profileoverview.actions.endherocreation":
            checkL10nNonEmptyString ("profileoverview.actions.endherocreation"),
          "addadventurepoints.title":
            checkL10nNonEmptyString ("addadventurepoints.title"),
          "addadventurepoints.actions.add":
            checkL10nNonEmptyString ("addadventurepoints.actions.add"),
          "addadventurepoints.actions.cancel":
            checkL10nNonEmptyString ("addadventurepoints.actions.cancel"),
          "addadventurepoints.options.adventurepoints":
            checkL10nNonEmptyString ("addadventurepoints.options.adventurepoints"),
          "changeheroavatar.title":
            checkL10nNonEmptyString ("changeheroavatar.title"),
          "changeheroavatar.actions.change":
            checkL10nNonEmptyString ("changeheroavatar.actions.change"),
          "changeheroavatar.options.selectfile":
            checkL10nNonEmptyString ("changeheroavatar.options.selectfile"),
          "changeheroavatar.warnings.invalidfile":
            checkL10nNonEmptyString ("changeheroavatar.warnings.invalidfile"),
          "personaldata.family":
            checkL10nNonEmptyString ("personaldata.family"),
          "personaldata.placeofbirth":
            checkL10nNonEmptyString ("personaldata.placeofbirth"),
          "personaldata.dateofbirth":
            checkL10nNonEmptyString ("personaldata.dateofbirth"),
          "personaldata.age":
            checkL10nNonEmptyString ("personaldata.age"),
          "personaldata.haircolor":
            checkL10nNonEmptyString ("personaldata.haircolor"),
          "personaldata.eyecolor":
            checkL10nNonEmptyString ("personaldata.eyecolor"),
          "personaldata.size":
            checkL10nNonEmptyString ("personaldata.size"),
          "personaldata.weight":
            checkL10nNonEmptyString ("personaldata.weight"),
          "personaldata.title":
            checkL10nNonEmptyString ("personaldata.title"),
          "personaldata.socialstatus":
            checkL10nNonEmptyString ("personaldata.socialstatus"),
          "personaldata.characteristics":
            checkL10nNonEmptyString ("personaldata.characteristics"),
          "personaldata.otherinfo":
            checkL10nNonEmptyString ("personaldata.otherinfo"),
          "personaldata.cultureareaknowledge":
            checkL10nNonEmptyString ("personaldata.cultureareaknowledge"),
          "socialstatus":
            checkL10nNonEmptyStringList ("socialstatus"),
          "haircolors":
            checkL10nNonEmptyStringList ("haircolors"),
          "eyecolors":
            checkL10nNonEmptyStringList ("eyecolors"),
          "pact.category":
            checkL10nNonEmptyString ("pact.category"),
          "pact.nopact":
            checkL10nNonEmptyString ("pact.nopact"),
          "pact.categories":
            checkL10nNonEmptyStringList ("pact.categories"),
          "pact.level":
            checkL10nNonEmptyString ("pact.level"),
          "pact.fairytype":
            checkL10nNonEmptyString ("pact.fairytype"),
          "pact.fairytypes":
            checkL10nNonEmptyStringList ("pact.fairytypes"),
          "domain":
            checkL10nNonEmptyString ("domain"),
          "userdefined":
            checkL10nNonEmptyString ("userdefined"),
          "pact.fairydomains":
            checkL10nNonEmptyStringList ("pact.fairydomains"),
          "settings.title":
            checkL10nNonEmptyString ("settings.title"),
          "settings.options.language":
            checkL10nNonEmptyString ("settings.options.language"),
          "settings.options.defaultlanguage":
            checkL10nNonEmptyString ("settings.options.defaultlanguage"),
          "settings.options.languagehint":
            checkL10nNonEmptyString ("settings.options.languagehint"),
          "settings.options.theme":
            checkL10nNonEmptyString ("settings.options.theme"),
          "settings.options.themedark":
            checkL10nNonEmptyString ("settings.options.themedark"),
          "settings.options.themelight":
            checkL10nNonEmptyString ("settings.options.themelight"),
          "settings.options.showanimations":
            checkL10nNonEmptyString ("settings.options.showanimations"),
          "settings.actions.close":
            checkL10nNonEmptyString ("settings.actions.close"),
          "checkforupdates":
            checkL10nNonEmptyString ("checkforupdates"),
          "charactersheet.title":
            checkL10nNonEmptyString ("charactersheet.title"),
          "charactersheet.actions.printtopdf":
            checkL10nNonEmptyString ("charactersheet.actions.printtopdf"),
          "charactersheet.options.showattributevalues":
            checkL10nNonEmptyString ("charactersheet.options.showattributevalues"),
          "charactersheet.main.title":
            checkL10nNonEmptyString ("charactersheet.main.title"),
          "charactersheet.main.heroname":
            checkL10nNonEmptyString ("charactersheet.main.heroname"),
          "charactersheet.main.race":
            checkL10nNonEmptyString ("charactersheet.main.race"),
          "charactersheet.main.culture":
            checkL10nNonEmptyString ("charactersheet.main.culture"),
          "charactersheet.main.profession":
            checkL10nNonEmptyString ("charactersheet.main.profession"),
          "charactersheet.main.family":
            checkL10nNonEmptyString ("charactersheet.main.family"),
          "charactersheet.main.placeofbirth":
            checkL10nNonEmptyString ("charactersheet.main.placeofbirth"),
          "charactersheet.main.dateofbirth":
            checkL10nNonEmptyString ("charactersheet.main.dateofbirth"),
          "charactersheet.main.sex":
            checkL10nNonEmptyString ("charactersheet.main.sex"),
          "charactersheet.main.age":
            checkL10nNonEmptyString ("charactersheet.main.age"),
          "charactersheet.main.haircolor":
            checkL10nNonEmptyString ("charactersheet.main.haircolor"),
          "charactersheet.main.eyecolor":
            checkL10nNonEmptyString ("charactersheet.main.eyecolor"),
          "charactersheet.main.size":
            checkL10nNonEmptyString ("charactersheet.main.size"),
          "charactersheet.main.weight":
            checkL10nNonEmptyString ("charactersheet.main.weight"),
          "charactersheet.main.herotitle":
            checkL10nNonEmptyString ("charactersheet.main.herotitle"),
          "charactersheet.main.socialstatus":
            checkL10nNonEmptyString ("charactersheet.main.socialstatus"),
          "charactersheet.main.characteristics":
            checkL10nNonEmptyString ("charactersheet.main.characteristics"),
          "charactersheet.main.otherinfo":
            checkL10nNonEmptyString ("charactersheet.main.otherinfo"),
          "charactersheet.main.experiencelevel":
            checkL10nNonEmptyString ("charactersheet.main.experiencelevel"),
          "charactersheet.main.totalap":
            checkL10nNonEmptyString ("charactersheet.main.totalap"),
          "charactersheet.main.apcollected":
            checkL10nNonEmptyString ("charactersheet.main.apcollected"),
          "charactersheet.main.apspent":
            checkL10nNonEmptyString ("charactersheet.main.apspent"),
          "charactersheet.main.avatar":
            checkL10nNonEmptyString ("charactersheet.main.avatar"),
          "charactersheet.main.advantages":
            checkL10nNonEmptyString ("charactersheet.main.advantages"),
          "charactersheet.main.disadvantages":
            checkL10nNonEmptyString ("charactersheet.main.disadvantages"),
          "charactersheet.main.generalspecialabilites":
            checkL10nNonEmptyString ("charactersheet.main.generalspecialabilites"),
          "charactersheet.main.generalspecialabilites.areaknowledge":
            checkL10nNonEmptyString ("charactersheet.main.generalspecialabilites.areaknowledge"),
          "charactersheet.main.fatepoints":
            checkL10nNonEmptyString ("charactersheet.main.fatepoints"),
          "charactersheet.main.headers.value":
            checkL10nNonEmptyString ("charactersheet.main.headers.value"),
          "charactersheet.main.headers.bonuspenalty":
            checkL10nNonEmptyString ("charactersheet.main.headers.bonuspenalty"),
          "charactersheet.main.headers.bonus":
            checkL10nNonEmptyString ("charactersheet.main.headers.bonus"),
          "charactersheet.main.headers.bought":
            checkL10nNonEmptyString ("charactersheet.main.headers.bought"),
          "charactersheet.main.headers.max":
            checkL10nNonEmptyString ("charactersheet.main.headers.max"),
          "charactersheet.main.headers.current":
            checkL10nNonEmptyString ("charactersheet.main.headers.current"),
          "charactersheet.main.subheaders.basestat":
            checkL10nNonEmptyString ("charactersheet.main.subheaders.basestat"),
          "charactersheet.main.subheaders.permanent":
            checkL10nNonEmptyString ("charactersheet.main.subheaders.permanent"),
          "charactersheet.gamestats.title":
            checkL10nNonEmptyString ("charactersheet.gamestats.title"),
          "charactersheet.gamestats.skills.title":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.title"),
          "charactersheet.gamestats.skills.headers.skill":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.skill"),
          "charactersheet.gamestats.skills.headers.check":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.check"),
          "charactersheet.gamestats.skills.headers.enc":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.enc"),
          "charactersheet.gamestats.skills.headers.ic":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.ic"),
          "charactersheet.gamestats.skills.headers.sr":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.sr"),
          "charactersheet.gamestats.skills.headers.r":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.r"),
          "charactersheet.gamestats.skills.headers.notes":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.headers.notes"),
          "charactersheet.gamestats.skills.enc.yes":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.enc.yes"),
          "charactersheet.gamestats.skills.enc.no":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.enc.no"),
          "charactersheet.gamestats.skills.enc.maybe":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.enc.maybe"),
          "charactersheet.gamestats.skills.subheaders.physical":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.physical"),
          "charactersheet.gamestats.skills.subheaders.physicalpages":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.physicalpages"),
          "charactersheet.gamestats.skills.subheaders.social":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.social"),
          "charactersheet.gamestats.skills.subheaders.socialpages":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.socialpages"),
          "charactersheet.gamestats.skills.subheaders.nature":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.nature"),
          "charactersheet.gamestats.skills.subheaders.naturepages":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.naturepages"),
          "charactersheet.gamestats.skills.subheaders.knowledge":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.knowledge"),
          "charactersheet.gamestats.skills.subheaders.knowledgepages":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.knowledgepages"),
          "charactersheet.gamestats.skills.subheaders.craft":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.craft"),
          "charactersheet.gamestats.skills.subheaders.craftpages":
            checkL10nNonEmptyString ("charactersheet.gamestats.skills.subheaders.craftpages"),
          "charactersheet.gamestats.languages.title":
            checkL10nNonEmptyString ("charactersheet.gamestats.languages.title"),
          "charactersheet.gamestats.languages.native":
            checkL10nNonEmptyString ("charactersheet.gamestats.languages.native"),
          "charactersheet.gamestats.knownscripts.title":
            checkL10nNonEmptyString ("charactersheet.gamestats.knownscripts.title"),
          "charactersheet.gamestats.routinechecks.title":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.title"),
          "charactersheet.gamestats.routinechecks.texts.first":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.texts.first"),
          "charactersheet.gamestats.routinechecks.texts.second":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.texts.second"),
          "charactersheet.gamestats.routinechecks.texts.third":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.texts.third"),
          "charactersheet.gamestats.routinechecks.texts.fourth":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.texts.fourth"),
          "charactersheet.gamestats.routinechecks.headers.checkmod":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.headers.checkmod"),
          "charactersheet.gamestats.routinechecks.headers.neededsr":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.headers.neededsr"),
          "charactersheet.gamestats.routinechecks.from":
            checkL10nNonEmptyString ("charactersheet.gamestats.routinechecks.from"),
          "charactersheet.gamestats.qualitylevels.title":
            checkL10nNonEmptyString ("charactersheet.gamestats.qualitylevels.title"),
          "charactersheet.gamestats.qualitylevels.headers.skillpoints":
            checkL10nNonEmptyString ("charactersheet.gamestats.qualitylevels.headers.skillpoints"),
          "charactersheet.gamestats.qualitylevels.headers.qualitylevel":
            checkL10nNonEmptyString ("charactersheet.gamestats.qualitylevels.headers.qualitylevel"),
          "charactersheet.attributemodifiers.title":
            checkL10nNonEmptyString ("charactersheet.attributemodifiers.title"),
          "charactersheet.combat.title":
            checkL10nNonEmptyString ("charactersheet.combat.title"),
          "charactersheet.combat.combattechniques.title":
            checkL10nNonEmptyString ("charactersheet.combat.combattechniques.title"),
          "charactersheet.combat.combattechniques.headers.name":
            checkL10nNonEmptyString ("charactersheet.combat.combattechniques.headers.name"),
          "charactersheet.combat.combattechniques.headers.primaryattribute":
            checkL10nNonEmptyString (
              "charactersheet.combat.combattechniques.headers.primaryattribute"
            ),
          "charactersheet.combat.combattechniques.headers.ic":
            checkL10nNonEmptyString ("charactersheet.combat.combattechniques.headers.ic"),
          "charactersheet.combat.combattechniques.headers.ctr":
            checkL10nNonEmptyString ("charactersheet.combat.combattechniques.headers.ctr"),
          "charactersheet.combat.combattechniques.headers.atrc":
            checkL10nNonEmptyString ("charactersheet.combat.combattechniques.headers.atrc"),
          "charactersheet.combat.combattechniques.headers.pa":
            checkL10nNonEmptyString ("charactersheet.combat.combattechniques.headers.pa"),
          "charactersheet.combat.lifepoints.title":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.title"),
          "charactersheet.combat.lifepoints.labels.max":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.max"),
          "charactersheet.combat.lifepoints.labels.current":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.current"),
          "charactersheet.combat.lifepoints.labels.pain1":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.pain1"),
          "charactersheet.combat.lifepoints.labels.pain2":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.pain2"),
          "charactersheet.combat.lifepoints.labels.pain3":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.pain3"),
          "charactersheet.combat.lifepoints.labels.pain4":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.pain4"),
          "charactersheet.combat.lifepoints.labels.dying":
            checkL10nNonEmptyString ("charactersheet.combat.lifepoints.labels.dying"),
          "charactersheet.combat.closecombatweapons.title":
            checkL10nNonEmptyString ("charactersheet.combat.closecombatweapons.title"),
          "charactersheet.combat.headers.weapon":
            checkL10nNonEmptyString ("charactersheet.combat.headers.weapon"),
          "charactersheet.combat.headers.combattechnique":
            checkL10nNonEmptyString ("charactersheet.combat.headers.combattechnique"),
          "charactersheet.combat.headers.damagebonus":
            checkL10nNonEmptyString ("charactersheet.combat.headers.damagebonus"),
          "charactersheet.combat.headers.dp":
            checkL10nNonEmptyString ("charactersheet.combat.headers.dp"),
          "charactersheet.combat.headers.atpamod":
            checkL10nNonEmptyString ("charactersheet.combat.headers.atpamod"),
          "charactersheet.combat.headers.reach":
            checkL10nNonEmptyString ("charactersheet.combat.headers.reach"),
          "charactersheet.combat.headers.reachlabels":
            checkL10nNonEmptyStringList ("charactersheet.combat.headers.reachlabels"),
          "charactersheet.combat.headers.bf":
            checkL10nNonEmptyString ("charactersheet.combat.headers.bf"),
          "charactersheet.combat.headers.loss":
            checkL10nNonEmptyString ("charactersheet.combat.headers.loss"),
          "charactersheet.combat.headers.at":
            checkL10nNonEmptyString ("charactersheet.combat.headers.at"),
          "charactersheet.combat.headers.pa":
            checkL10nNonEmptyString ("charactersheet.combat.headers.pa"),
          "charactersheet.combat.headers.weight":
            checkL10nNonEmptyString ("charactersheet.combat.headers.weight"),
          "charactersheet.combat.headers.weightunit":
            checkL10nNonEmptyString ("charactersheet.combat.headers.weightunit"),
          "charactersheet.combat.rangedcombatweapons.title":
            checkL10nNonEmptyString ("charactersheet.combat.rangedcombatweapons.title"),
          "charactersheet.combat.headers.reloadtime":
            checkL10nNonEmptyString ("charactersheet.combat.headers.reloadtime"),
          "charactersheet.combat.headers.rangebrackets":
            checkL10nNonEmptyString ("charactersheet.combat.headers.rangebrackets"),
          "charactersheet.combat.headers.rangedcombat":
            checkL10nNonEmptyString ("charactersheet.combat.headers.rangedcombat"),
          "charactersheet.combat.headers.ammunition":
            checkL10nNonEmptyString ("charactersheet.combat.headers.ammunition"),
          "charactersheet.combat.armor.title":
            checkL10nNonEmptyString ("charactersheet.combat.armor.title"),
          "charactersheet.combat.headers.armor":
            checkL10nNonEmptyString ("charactersheet.combat.headers.armor"),
          "charactersheet.combat.headers.st":
            checkL10nNonEmptyString ("charactersheet.combat.headers.st"),
          "charactersheet.combat.headers.pro":
            checkL10nNonEmptyString ("charactersheet.combat.headers.pro"),
          "charactersheet.combat.headers.enc":
            checkL10nNonEmptyString ("charactersheet.combat.headers.enc"),
          "charactersheet.combat.headers.addpenalties":
            checkL10nNonEmptyString ("charactersheet.combat.headers.addpenalties"),
          "charactersheet.combat.headers.where":
            checkL10nNonEmptyString ("charactersheet.combat.headers.where"),
          "charactersheet.combat.headers.head":
            checkL10nNonEmptyString ("charactersheet.combat.headers.head"),
          "charactersheet.combat.headers.torso":
            checkL10nNonEmptyString ("charactersheet.combat.headers.torso"),
          "charactersheet.combat.headers.leftarm":
            checkL10nNonEmptyString ("charactersheet.combat.headers.leftarm"),
          "charactersheet.combat.headers.rightarm":
            checkL10nNonEmptyString ("charactersheet.combat.headers.rightarm"),
          "charactersheet.combat.headers.leftleg":
            checkL10nNonEmptyString ("charactersheet.combat.headers.leftleg"),
          "charactersheet.combat.headers.rightleg":
            checkL10nNonEmptyString ("charactersheet.combat.headers.rightleg"),
          "charactersheet.combat.shieldparryingweapon.title":
            checkL10nNonEmptyString ("charactersheet.combat.shieldparryingweapon.title"),
          "charactersheet.combat.headers.shieldparryingweapon":
            checkL10nNonEmptyString ("charactersheet.combat.headers.shieldparryingweapon"),
          "charactersheet.combat.headers.structurepoints":
            checkL10nNonEmptyString ("charactersheet.combat.headers.structurepoints"),
          "charactersheet.combat.content.dice":
            checkL10nNonEmptyString ("charactersheet.combat.content.dice"),
          "charactersheet.combat.content.actions":
            checkL10nNonEmptyString ("charactersheet.combat.content.actions"),
          "charactersheet.combat.combatspecialabilities.title":
            checkL10nNonEmptyString ("charactersheet.combat.combatspecialabilities.title"),
          "charactersheet.combat.conditionsstates.conditions":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions"),
          "charactersheet.combat.conditionsstates.conditions.animosity":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.animosity"),
          "charactersheet.combat.conditionsstates.conditions.encumbrance":
            checkL10nNonEmptyString (
              "charactersheet.combat.conditionsstates.conditions.encumbrance"
            ),
          "charactersheet.combat.conditionsstates.conditions.intoxicated":
            checkL10nNonEmptyString (
              "charactersheet.combat.conditionsstates.conditions.intoxicated"
            ),
          "charactersheet.combat.conditionsstates.conditions.stupor":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.stupor"),
          "charactersheet.combat.conditionsstates.conditions.rapture":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.rapture"),
          "charactersheet.combat.conditionsstates.conditions.fear":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.fear"),
          "charactersheet.combat.conditionsstates.conditions.paralysis":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.paralysis"),
          "charactersheet.combat.conditionsstates.conditions.pain":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.pain"),
          "charactersheet.combat.conditionsstates.conditions.confusion":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.conditions.confusion"),
          "charactersheet.combat.conditionsstates.states":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states"),
          "charactersheet.combat.conditionsstates.states.immobilized":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.immobilized"),
          "charactersheet.combat.conditionsstates.states.unconscious":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.unconscious"),
          "charactersheet.combat.conditionsstates.states.blind":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.blind"),
          "charactersheet.combat.conditionsstates.states.bloodlust":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.bloodlust"),
          "charactersheet.combat.conditionsstates.states.burning":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.burning"),
          "charactersheet.combat.conditionsstates.states.cramped":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.cramped"),
          "charactersheet.combat.conditionsstates.states.bound":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.bound"),
          "charactersheet.combat.conditionsstates.states.incapacitated":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.incapacitated"),
          "charactersheet.combat.conditionsstates.states.diseased":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.diseased"),
          "charactersheet.combat.conditionsstates.states.prone":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.prone"),
          "charactersheet.combat.conditionsstates.states.misfortune":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.misfortune"),
          "charactersheet.combat.conditionsstates.states.rage":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.rage"),
          "charactersheet.combat.conditionsstates.states.mute":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.mute"),
          "charactersheet.combat.conditionsstates.states.deaf":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.deaf"),
          "charactersheet.combat.conditionsstates.states.surprised":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.surprised"),
          "charactersheet.combat.conditionsstates.states.badsmell":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.badsmell"),
          "charactersheet.combat.conditionsstates.states.invisible":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.invisible"),
          "charactersheet.combat.conditionsstates.states.poisoned":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.poisoned"),
          "charactersheet.combat.conditionsstates.states.petrified":
            checkL10nNonEmptyString ("charactersheet.combat.conditionsstates.states.petrified"),
          "charactersheet.belongings.title":
            checkL10nNonEmptyString ("charactersheet.belongings.title"),
          "charactersheet.belongings.equipment.title":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.title"),
          "charactersheet.belongings.equipment.headers.item":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.headers.item"),
          "charactersheet.belongings.equipment.headers.number":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.headers.number"),
          "charactersheet.belongings.equipment.headers.price":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.headers.price"),
          "charactersheet.belongings.equipment.headers.weight":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.headers.weight"),
          "charactersheet.belongings.equipment.headers.carriedwhere":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.headers.carriedwhere"),
          "charactersheet.belongings.equipment.footers.total":
            checkL10nNonEmptyString ("charactersheet.belongings.equipment.footers.total"),
          "charactersheet.belongings.purse.title":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.title"),
          "charactersheet.belongings.purse.labels.ducats":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.ducats"),
          "charactersheet.belongings.purse.labels.silverthalers":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.silverthalers"),
          "charactersheet.belongings.purse.labels.halers":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.halers"),
          "charactersheet.belongings.purse.labels.kreutzers":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.kreutzers"),
          "charactersheet.belongings.purse.labels.gems":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.gems"),
          "charactersheet.belongings.purse.labels.jewelry":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.jewelry"),
          "charactersheet.belongings.purse.labels.other":
            checkL10nNonEmptyString ("charactersheet.belongings.purse.labels.other"),
          "charactersheet.belongings.carryingcapacity.title":
            checkL10nNonEmptyString ("charactersheet.belongings.carryingcapacity.title"),
          "charactersheet.belongings.carryingcapacity.calc":
            checkL10nNonEmptyString ("charactersheet.belongings.carryingcapacity.calc"),
          "charactersheet.belongings.carryingcapacity.label":
            checkL10nNonEmptyString ("charactersheet.belongings.carryingcapacity.label"),
          "charactersheet.belongings.animal.title":
            checkL10nNonEmptyString ("charactersheet.belongings.animal.title"),
          "charactersheet.spells.title":
            checkL10nNonEmptyString ("charactersheet.spells.title"),
          "charactersheet.spells.headers.aemax":
            checkL10nNonEmptyString ("charactersheet.spells.headers.aemax"),
          "charactersheet.spells.headers.aecurrent":
            checkL10nNonEmptyString ("charactersheet.spells.headers.aecurrent"),
          "charactersheet.spells.spellslist.title":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.title"),
          "charactersheet.spells.spellslist.headers.spellritual":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.spellritual"),
          "charactersheet.spells.spellslist.headers.check":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.check"),
          "charactersheet.spells.spellslist.headers.sr":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.sr"),
          "charactersheet.spells.spellslist.headers.cost":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.cost"),
          "charactersheet.spells.spellslist.headers.castingtime":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.castingtime"),
          "charactersheet.spells.spellslist.headers.range":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.range"),
          "charactersheet.spells.spellslist.headers.duration":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.duration"),
          "charactersheet.spells.spellslist.headers.property":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.property"),
          "charactersheet.spells.spellslist.headers.ic":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.ic"),
          "charactersheet.spells.spellslist.headers.effect":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.effect"),
          "charactersheet.spells.spellslist.headers.page":
            checkL10nNonEmptyString ("charactersheet.spells.spellslist.headers.page"),
          "charactersheet.spells.traditionsproperties.labels.primaryattribute":
            checkL10nNonEmptyString (
              "charactersheet.spells.traditionsproperties.labels.primaryattribute"
            ),
          "charactersheet.spells.traditionsproperties.labels.properties":
            checkL10nNonEmptyString (
              "charactersheet.spells.traditionsproperties.labels.properties"
            ),
          "charactersheet.spells.traditionsproperties.labels.tradition":
            checkL10nNonEmptyString ("charactersheet.spells.traditionsproperties.labels.tradition"),
          "charactersheet.spells.magicalspecialabilities.title":
            checkL10nNonEmptyString ("charactersheet.spells.magicalspecialabilities.title"),
          "charactersheet.spells.cantrips.title":
            checkL10nNonEmptyString ("charactersheet.spells.cantrips.title"),
          "charactersheet.chants.title":
            checkL10nNonEmptyString ("charactersheet.chants.title"),
          "charactersheet.chants.headers.kpmax":
            checkL10nNonEmptyString ("charactersheet.chants.headers.kpmax"),
          "charactersheet.chants.headers.kpcurrent":
            checkL10nNonEmptyString ("charactersheet.chants.headers.kpcurrent"),
          "charactersheet.chants.chantslist.title":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.title"),
          "charactersheet.chants.chantslist.headers.liturgyceremony":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.liturgyceremony"),
          "charactersheet.chants.chantslist.headers.check":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.check"),
          "charactersheet.chants.chantslist.headers.sr":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.sr"),
          "charactersheet.chants.chantslist.headers.cost":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.cost"),
          "charactersheet.chants.chantslist.headers.castingtime":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.castingtime"),
          "charactersheet.chants.chantslist.headers.range":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.range"),
          "charactersheet.chants.chantslist.headers.duration":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.duration"),
          "charactersheet.chants.chantslist.headers.property":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.property"),
          "charactersheet.chants.chantslist.headers.ic":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.ic"),
          "charactersheet.chants.chantslist.headers.effect":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.effect"),
          "charactersheet.chants.chantslist.headers.page":
            checkL10nNonEmptyString ("charactersheet.chants.chantslist.headers.page"),
          "charactersheet.chants.traditionsaspects.labels.primaryattribute":
            checkL10nNonEmptyString (
              "charactersheet.chants.traditionsaspects.labels.primaryattribute"
            ),
          "charactersheet.chants.traditionsaspects.labels.aspects":
            checkL10nNonEmptyString ("charactersheet.chants.traditionsaspects.labels.aspects"),
          "charactersheet.chants.traditionsaspects.labels.tradition":
            checkL10nNonEmptyString ("charactersheet.chants.traditionsaspects.labels.tradition"),
          "charactersheet.chants.blessedspecialabilities.title":
            checkL10nNonEmptyString ("charactersheet.chants.blessedspecialabilities.title"),
          "charactersheet.chants.blessings.title":
            checkL10nNonEmptyString ("charactersheet.chants.blessings.title"),
          "rules.rulebase":
            checkL10nNonEmptyString ("rules.rulebase"),
          "rules.optionalrules":
            checkL10nNonEmptyString ("rules.optionalrules"),
          "rules.optionalrules.maximumattributescores":
            checkL10nNonEmptyString ("rules.optionalrules.maximumattributescores"),
          "rules.optionalrules.higherdefensestats":
            checkL10nNonEmptyString ("rules.optionalrules.higherdefensestats"),
          "rules.optionalrules.languagespecializations":
            checkL10nNonEmptyString ("rules.optionalrules.languagespecializations"),
          "secondaryattributes.lp.name":
            checkL10nNonEmptyString ("secondaryattributes.lp.name"),
          "secondaryattributes.lp.short":
            checkL10nNonEmptyString ("secondaryattributes.lp.short"),
          "secondaryattributes.lp.calc":
            checkL10nNonEmptyString ("secondaryattributes.lp.calc"),
          "secondaryattributes.ae.name":
            checkL10nNonEmptyString ("secondaryattributes.ae.name"),
          "secondaryattributes.ae.short":
            checkL10nNonEmptyString ("secondaryattributes.ae.short"),
          "secondaryattributes.ae.calc":
            checkL10nNonEmptyString ("secondaryattributes.ae.calc"),
          "secondaryattributes.kp.name":
            checkL10nNonEmptyString ("secondaryattributes.kp.name"),
          "secondaryattributes.kp.short":
            checkL10nNonEmptyString ("secondaryattributes.kp.short"),
          "secondaryattributes.kp.calc":
            checkL10nNonEmptyString ("secondaryattributes.kp.calc"),
          "secondaryattributes.spi.name":
            checkL10nNonEmptyString ("secondaryattributes.spi.name"),
          "secondaryattributes.spi.short":
            checkL10nNonEmptyString ("secondaryattributes.spi.short"),
          "secondaryattributes.spi.calc":
            checkL10nNonEmptyString ("secondaryattributes.spi.calc"),
          "secondaryattributes.tou.name":
            checkL10nNonEmptyString ("secondaryattributes.tou.name"),
          "secondaryattributes.tou.short":
            checkL10nNonEmptyString ("secondaryattributes.tou.short"),
          "secondaryattributes.tou.calc":
            checkL10nNonEmptyString ("secondaryattributes.tou.calc"),
          "secondaryattributes.do.name":
            checkL10nNonEmptyString ("secondaryattributes.do.name"),
          "secondaryattributes.do.short":
            checkL10nNonEmptyString ("secondaryattributes.do.short"),
          "secondaryattributes.do.calc":
            checkL10nNonEmptyString ("secondaryattributes.do.calc"),
          "secondaryattributes.ini.name":
            checkL10nNonEmptyString ("secondaryattributes.ini.name"),
          "secondaryattributes.ini.short":
            checkL10nNonEmptyString ("secondaryattributes.ini.short"),
          "secondaryattributes.ini.calc":
            checkL10nNonEmptyString ("secondaryattributes.ini.calc"),
          "secondaryattributes.mov.name":
            checkL10nNonEmptyString ("secondaryattributes.mov.name"),
          "secondaryattributes.mov.short":
            checkL10nNonEmptyString ("secondaryattributes.mov.short"),
          "secondaryattributes.mov.calc":
            checkL10nNonEmptyString ("secondaryattributes.mov.calc"),
          "secondaryattributes.ws.name":
            checkL10nNonEmptyString ("secondaryattributes.ws.name"),
          "secondaryattributes.ws.short":
            checkL10nNonEmptyString ("secondaryattributes.ws.short"),
          "secondaryattributes.ws.calc":
            checkL10nNonEmptyString ("secondaryattributes.ws.calc"),
          "permanentpoints.boughtback":
            checkL10nNonEmptyString ("permanentpoints.boughtback"),
          "permanentpoints.spent":
            checkL10nNonEmptyString ("permanentpoints.spent"),
          "rcp.actions.select":
            checkL10nNonEmptyString ("rcp.actions.select"),
          "rcp.actions.next":
            checkL10nNonEmptyString ("rcp.actions.next"),
          "races.options.showvalues":
            checkL10nNonEmptyString ("races.options.showvalues"),
          "aptext":
            checkL10nNonEmptyString ("aptext"),
          "apshort":
            checkL10nNonEmptyString ("apshort"),
          "info.apvalue":
            checkL10nNonEmptyString ("info.apvalue"),
          "info.lifepointbasevalue":
            checkL10nNonEmptyString ("info.lifepointbasevalue"),
          "info.spiritbasevalue":
            checkL10nNonEmptyString ("info.spiritbasevalue"),
          "info.toughnessbasevalue":
            checkL10nNonEmptyString ("info.toughnessbasevalue"),
          "info.movementbasevalue":
            checkL10nNonEmptyString ("info.movementbasevalue"),
          "info.attributeadjustments":
            checkL10nNonEmptyString ("info.attributeadjustments"),
          "info.commoncultures":
            checkL10nNonEmptyString ("info.commoncultures"),
          "info.automaticadvantages":
            checkL10nNonEmptyString ("info.automaticadvantages"),
          "info.stronglyrecommendedadvantages":
            checkL10nNonEmptyString ("info.stronglyrecommendedadvantages"),
          "info.stronglyrecommendeddisadvantages":
            checkL10nNonEmptyString ("info.stronglyrecommendeddisadvantages"),
          "info.commonadvantages":
            checkL10nNonEmptyString ("info.commonadvantages"),
          "info.commondisadvantages":
            checkL10nNonEmptyString ("info.commondisadvantages"),
          "info.uncommonadvantages":
            checkL10nNonEmptyString ("info.uncommonadvantages"),
          "info.uncommondisadvantages":
            checkL10nNonEmptyString ("info.uncommondisadvantages"),
          "info.none":
            checkL10nNonEmptyString ("info.none"),
          "cultures.options.allcultures":
            checkL10nNonEmptyString ("cultures.options.allcultures"),
          "cultures.options.commoncultures":
            checkL10nNonEmptyString ("cultures.options.commoncultures"),
          "cultures.options.showculturalpackagevalues":
            checkL10nNonEmptyString ("cultures.options.showculturalpackagevalues"),
          "info.language":
            checkL10nNonEmptyString ("info.language"),
          "info.or":
            checkL10nNonEmptyString ("info.or"),
          "info.script":
            checkL10nNonEmptyString ("info.script"),
          "info.areaknowledge":
            checkL10nNonEmptyString ("info.areaknowledge"),
          "info.socialstatus":
            checkL10nNonEmptyString ("info.socialstatus"),
          "info.commonprofessions":
            checkL10nNonEmptyString ("info.commonprofessions"),
          "info.commonmundaneprofessions":
            checkL10nNonEmptyString ("info.commonmundaneprofessions"),
          "info.commonmagicprofessions":
            checkL10nNonEmptyString ("info.commonmagicprofessions"),
          "info.commonblessedprofessions":
            checkL10nNonEmptyString ("info.commonblessedprofessions"),
          "info.commonskills":
            checkL10nNonEmptyString ("info.commonskills"),
          "info.uncommonskills":
            checkL10nNonEmptyString ("info.uncommonskills"),
          "info.commonnames":
            checkL10nNonEmptyString ("info.commonnames"),
          "info.culturalpackage":
            checkL10nNonEmptyString ("info.culturalpackage"),
          "professions.options.allprofessions":
            checkL10nNonEmptyString ("professions.options.allprofessions"),
          "professions.options.commonprofessions":
            checkL10nNonEmptyString ("professions.options.commonprofessions"),
          "professions.options.allprofessiongroups":
            checkL10nNonEmptyString ("professions.options.allprofessiongroups"),
          "professions.options.mundaneprofessions":
            checkL10nNonEmptyString ("professions.options.mundaneprofessions"),
          "professions.options.magicalprofessions":
            checkL10nNonEmptyString ("professions.options.magicalprofessions"),
          "professions.options.blessedprofessions":
            checkL10nNonEmptyString ("professions.options.blessedprofessions"),
          "professions.options.alwaysshowprofessionsfromextensions":
            checkL10nNonEmptyString ("professions.options.alwaysshowprofessionsfromextensions"),
          "professions.options.novariant":
            checkL10nNonEmptyString ("professions.options.novariant"),
          "professions.ownprofession":
            checkL10nNonEmptyString ("professions.ownprofession"),
          "info.prerequisites":
            checkL10nNonEmptyString ("info.prerequisites"),
          "info.specialabilities":
            checkL10nNonEmptyString ("info.specialabilities"),
          "info.specialabilitieslanguagesandliteracy":
            checkL10nNonEmptyString ("info.specialabilitieslanguagesandliteracy"),
          "info.specialabilitiesspecialization":
            checkL10nNonEmptyString ("info.specialabilitiesspecialization"),
          "info.specialabilitiesspecializationseparator":
            checkL10nNonEmptyString ("info.specialabilitiesspecializationseparator"),
          "info.specialabilitiescurses":
            checkL10nNonEmptyString ("info.specialabilitiescurses"),
          "info.combattechniques":
            checkL10nNonEmptyString ("info.combattechniques"),
          "info.combattechniquesselection":
            checkL10nNonEmptyString ("info.combattechniquesselection"),
          "info.combattechniquesselectioncounter":
            checkL10nNonEmptyStringList ("info.combattechniquesselectioncounter"),
          "info.combattechniquessecondselection":
            checkL10nNonEmptyString ("info.combattechniquessecondselection"),
          "info.skills":
            checkL10nNonEmptyString ("info.skills"),
          "info.skillsselection":
            checkL10nNonEmptyString ("info.skillsselection"),
          "info.spells":
            checkL10nNonEmptyString ("info.spells"),
          "info.spellscantrips":
            checkL10nNonEmptyString ("info.spellscantrips"),
          "info.spellscantripscounter":
            checkL10nNonEmptyStringList ("info.spellscantripscounter"),
          "info.liturgicalchants":
            checkL10nNonEmptyString ("info.liturgicalchants"),
          "info.thetwelveblessings":
            checkL10nNonEmptyString ("info.thetwelveblessings"),
          "info.thetwelveblessingsexceptions":
            checkL10nNonEmptyString ("info.thetwelveblessingsexceptions"),
          "info.suggestedadvantages":
            checkL10nNonEmptyString ("info.suggestedadvantages"),
          "info.suggesteddisadvantages":
            checkL10nNonEmptyString ("info.suggesteddisadvantages"),
          "info.unsuitableadvantages":
            checkL10nNonEmptyString ("info.unsuitableadvantages"),
          "info.unsuitabledisadvantages":
            checkL10nNonEmptyString ("info.unsuitabledisadvantages"),
          "info.variants":
            checkL10nNonEmptyString ("info.variants"),
          "info.variantsinsteadof":
            checkL10nNonEmptyString ("info.variantsinsteadof"),
          "rcpselections.labels.selectattributeadjustment":
            checkL10nNonEmptyString ("rcpselections.labels.selectattributeadjustment"),
          "rcpselections.labels.buyculturalpackage":
            checkL10nNonEmptyString ("rcpselections.labels.buyculturalpackage"),
          "rcpselections.labels.selectnativetongue":
            checkL10nNonEmptyString ("rcpselections.labels.selectnativetongue"),
          "rcpselections.labels.buyscript":
            checkL10nNonEmptyString ("rcpselections.labels.buyscript"),
          "rcpselections.labels.selectscript":
            checkL10nNonEmptyString ("rcpselections.labels.selectscript"),
          "rcpselections.labels.onecantrip":
            checkL10nNonEmptyString ("rcpselections.labels.onecantrip"),
          "rcpselections.labels.twocantrips":
            checkL10nNonEmptyString ("rcpselections.labels.twocantrips"),
          "rcpselections.labels.fromthefollowinglist":
            checkL10nNonEmptyString ("rcpselections.labels.fromthefollowinglist"),
          "rcpselections.labels.one":
            checkL10nNonEmptyString ("rcpselections.labels.one"),
          "rcpselections.labels.two":
            checkL10nNonEmptyString ("rcpselections.labels.two"),
          "rcpselections.labels.more":
            checkL10nNonEmptyString ("rcpselections.labels.more"),
          "rcpselections.labels.ofthefollowingcombattechniques":
            checkL10nNonEmptyString ("rcpselections.labels.ofthefollowingcombattechniques"),
          "rcpselections.labels.curses":
            checkL10nNonEmptyString ("rcpselections.labels.curses"),
          "rcpselections.labels.languagesandliteracytotaling":
            checkL10nNonEmptyString ("rcpselections.labels.languagesandliteracytotaling"),
          "rcpselections.labels.left":
            checkL10nNonEmptyString ("rcpselections.labels.left"),
          "rcpselections.labels.applicationforskillspecialization":
            checkL10nNonEmptyString ("rcpselections.labels.applicationforskillspecialization"),
          "rcpselections.labels.skillapplicationseparator":
            checkL10nNonEmptyString ("rcpselections.labels.skillapplicationseparator"),
          "rcpselections.labels.skillgroups":
            checkL10nNonEmptyStringList ("rcpselections.labels.skillgroups"),
          "rcpselections.labels.skills":
            checkL10nNonEmptyString ("rcpselections.labels.skills"),
          "rcpselections.actions.complete":
            checkL10nNonEmptyString ("rcpselections.actions.complete"),
          "attributes.view.attributetotal":
            checkL10nNonEmptyString ("attributes.view.attributetotal"),
          "attributes.tooltips.modifier":
            checkL10nNonEmptyString ("attributes.tooltips.modifier"),
          "attributes.tooltips.bought":
            checkL10nNonEmptyString ("attributes.tooltips.bought"),
          "attributes.tooltips.losttotal":
            checkL10nNonEmptyString ("attributes.tooltips.losttotal"),
          "attributes.tooltips.boughtback":
            checkL10nNonEmptyString ("attributes.tooltips.boughtback"),
          "plp.short":
            checkL10nNonEmptyString ("plp.short"),
          "plp.long":
            checkL10nNonEmptyString ("plp.long"),
          "attributes.pae.name":
            checkL10nNonEmptyString ("attributes.pae.name"),
          "attributes.pae.short":
            checkL10nNonEmptyString ("attributes.pae.short"),
          "attributes.pkp.name":
            checkL10nNonEmptyString ("attributes.pkp.name"),
          "attributes.pkp.short":
            checkL10nNonEmptyString ("attributes.pkp.short"),
          "advantages.options.common":
            checkL10nNonEmptyString ("advantages.options.common"),
          "disadvantages.options.common":
            checkL10nNonEmptyString ("disadvantages.options.common"),
          "activatable.view.afraidof":
            checkL10nNonEmptyString ("activatable.view.afraidof"),
          "activatable.view.immunityto":
            checkL10nNonEmptyString ("activatable.view.immunityto"),
          "activatable.view.hatredof":
            checkL10nNonEmptyString ("activatable.view.hatredof"),
          "info.rules":
            checkL10nNonEmptyString ("info.rules"),
          "info.extendedcombatspecialabilities":
            checkL10nNonEmptyString ("info.extendedcombatspecialabilities"),
          "info.extendedmagicalspecialabilities":
            checkL10nNonEmptyString ("info.extendedmagicalspecialabilities"),
          "info.extendedblessedtspecialabilities":
            checkL10nNonEmptyString ("info.extendedblessedtspecialabilities"),
          "info.penalty":
            checkL10nNonEmptyString ("info.penalty"),
          "info.tier":
            checkL10nNonEmptyString ("info.tier"),
          "info.pertier":
            checkL10nNonEmptyString ("info.pertier"),
          "info.volume":
            checkL10nNonEmptyString ("info.volume"),
          "info.bindingcost":
            checkL10nNonEmptyString ("info.bindingcost"),
          "info.protectivecircle":
            checkL10nNonEmptyString ("info.protectivecircle"),
          "info.wardingcircle":
            checkL10nNonEmptyString ("info.wardingcircle"),
          "info.actions":
            checkL10nNonEmptyString ("info.actions"),
          "tier":
            checkL10nNonEmptyString ("tier"),
          "requiresrcp":
            checkL10nNonEmptyString ("requiresrcp"),
          "advantage":
            checkL10nNonEmptyString ("advantage"),
          "disadvantage":
            checkL10nNonEmptyString ("disadvantage"),
          "primaryattributeofthetradition":
            checkL10nNonEmptyString ("primaryattributeofthetradition"),
          "knowledgeofspell":
            checkL10nNonEmptyString ("knowledgeofspell"),
          "knowledgeofliturgicalchant":
            checkL10nNonEmptyString ("knowledgeofliturgicalchant"),
          "race":
            checkL10nNonEmptyString ("race"),
          "appropriatecombatstylespecialability":
            checkL10nNonEmptyString ("appropriatecombatstylespecialability"),
          "appropriatemagicalstylespecialability":
            checkL10nNonEmptyString ("appropriatemagicalstylespecialability"),
          "appropriateblessedstylespecialability":
            checkL10nNonEmptyString ("appropriateblessedstylespecialability"),
          "customcost.title":
            checkL10nNonEmptyString ("customcost.title"),
          "customcost.message":
            checkL10nNonEmptyString ("customcost.message"),
          "skills.options.commoninculture":
            checkL10nNonEmptyString ("skills.options.commoninculture"),
          "skills.view.groups":
            checkL10nNonEmptyStringList ("skills.view.groups"),
          "info.check":
            checkL10nNonEmptyString ("info.check"),
          "info.newapplications":
            checkL10nNonEmptyString ("info.newapplications"),
          "info.applications":
            checkL10nNonEmptyString ("info.applications"),
          "info.encumbrance":
            checkL10nNonEmptyString ("info.encumbrance"),
          "info.tools":
            checkL10nNonEmptyString ("info.tools"),
          "info.quality":
            checkL10nNonEmptyString ("info.quality"),
          "info.failedcheck":
            checkL10nNonEmptyString ("info.failedcheck"),
          "info.criticalsuccess":
            checkL10nNonEmptyString ("info.criticalsuccess"),
          "info.botch":
            checkL10nNonEmptyString ("info.botch"),
          "info.improvementcost":
            checkL10nNonEmptyString ("info.improvementcost"),
          "view.commoninculture":
            checkL10nNonEmptyString ("view.commoninculture"),
          "view.uncommoninculture":
            checkL10nNonEmptyString ("view.uncommoninculture"),
          "combattechniques.view.groups":
            checkL10nNonEmptyStringList ("combattechniques.view.groups"),
          "info.special":
            checkL10nNonEmptyString ("info.special"),
          "actions.addtolist":
            checkL10nNonEmptyString ("actions.addtolist"),
          "specialabilities.view.groups":
            checkL10nNonEmptyStringList ("specialabilities.view.groups"),
          "info.specialabilities.subgroups":
            checkL10nNonEmptyStringList ("info.specialabilities.subgroups"),
          "spells.view.groups":
            checkL10nNonEmptyStringList ("spells.view.groups"),
          "spells.view.cantrip":
            checkL10nNonEmptyString ("spells.view.cantrip"),
          "spells.view.properties":
            checkL10nNonEmptyStringList ("spells.view.properties"),
          "spells.view.traditions":
            checkL10nNonEmptyStringList ("spells.view.traditions"),
          "info.effect":
            checkL10nNonEmptyString ("info.effect"),
          "info.castingtime":
            checkL10nNonEmptyString ("info.castingtime"),
          "info.ritualtime":
            checkL10nNonEmptyString ("info.ritualtime"),
          "info.aecost":
            checkL10nNonEmptyString ("info.aecost"),
          "info.range":
            checkL10nNonEmptyString ("info.range"),
          "info.duration":
            checkL10nNonEmptyString ("info.duration"),
          "info.targetcategory":
            checkL10nNonEmptyString ("info.targetcategory"),
          "info.property":
            checkL10nNonEmptyString ("info.property"),
          "info.traditions":
            checkL10nNonEmptyString ("info.traditions"),
          "info.note":
            checkL10nNonEmptyString ("info.note"),
          "info.lengthoftime":
            checkL10nNonEmptyString ("info.lengthoftime"),
          "info.skill":
            checkL10nNonEmptyString ("info.skill"),
          "info.musictradition":
            checkL10nNonEmptyString ("info.musictradition"),
          "liturgies.view.groups":
            checkL10nNonEmptyStringList ("liturgies.view.groups"),
          "liturgies.view.blessing":
            checkL10nNonEmptyString ("liturgies.view.blessing"),
          "liturgies.view.aspects":
            checkL10nNonEmptyStringList ("liturgies.view.aspects"),
          "liturgies.view.traditions":
            checkL10nNonEmptyStringList ("liturgies.view.traditions"),
          "info.liturgicaltime":
            checkL10nNonEmptyString ("info.liturgicaltime"),
          "info.ceremonialtime":
            checkL10nNonEmptyString ("info.ceremonialtime"),
          "info.kpcost":
            checkL10nNonEmptyString ("info.kpcost"),
          "info.aspect":
            checkL10nNonEmptyString ("info.aspect"),
          "equipment.actions.create":
            checkL10nNonEmptyString ("equipment.actions.create"),
          "equipment.view.purse":
            checkL10nNonEmptyString ("equipment.view.purse"),
          "equipment.view.ducates":
            checkL10nNonEmptyString ("equipment.view.ducates"),
          "equipment.view.silverthalers":
            checkL10nNonEmptyString ("equipment.view.silverthalers"),
          "equipment.view.hellers":
            checkL10nNonEmptyString ("equipment.view.hellers"),
          "equipment.view.kreutzers":
            checkL10nNonEmptyString ("equipment.view.kreutzers"),
          "equipment.view.initialstartingwealth":
            checkL10nNonEmptyString ("equipment.view.initialstartingwealth"),
          "equipment.view.carringandliftingcapactity":
            checkL10nNonEmptyString ("equipment.view.carringandliftingcapactity"),
          "equipment.view.price":
            checkL10nNonEmptyString ("equipment.view.price"),
          "equipment.view.weight":
            checkL10nNonEmptyString ("equipment.view.weight"),
          "equipment.view.groups":
            checkL10nNonEmptyStringList ("equipment.view.groups"),
          "equipment.view.armortypes":
            checkL10nNonEmptyStringList ("equipment.view.armortypes"),
          "equipment.view.dice":
            checkL10nNonEmptyStringList ("equipment.view.dice"),
          "equipment.view.list.ammunitionsubtitle":
            checkL10nNonEmptyString ("equipment.view.list.ammunitionsubtitle"),
          "equipment.view.list.weight":
            checkL10nNonEmptyString ("equipment.view.list.weight"),
          "equipment.view.list.weightunit":
            checkL10nNonEmptyString ("equipment.view.list.weightunit"),
          "equipment.view.list.price":
            checkL10nNonEmptyString ("equipment.view.list.price"),
          "equipment.view.list.priceunit":
            checkL10nNonEmptyString ("equipment.view.list.priceunit"),
          "equipment.view.list.combattechnique":
            checkL10nNonEmptyString ("equipment.view.list.combattechnique"),
          "equipment.view.list.damage":
            checkL10nNonEmptyString ("equipment.view.list.damage"),
          "equipment.view.list.dice":
            checkL10nNonEmptyString ("equipment.view.list.dice"),
          "equipment.view.list.primaryattributedamagethreshold":
            checkL10nNonEmptyString ("equipment.view.list.primaryattributedamagethreshold"),
          "equipment.view.list.atpamod":
            checkL10nNonEmptyString ("equipment.view.list.atpamod"),
          "equipment.view.list.reach":
            checkL10nNonEmptyString ("equipment.view.list.reach"),
          "equipment.view.list.reachlabels":
            checkL10nNonEmptyStringList ("equipment.view.list.reachlabels"),
          "equipment.view.list.length":
            checkL10nNonEmptyString ("equipment.view.list.length"),
          "equipment.view.list.lengthunit":
            checkL10nNonEmptyString ("equipment.view.list.lengthunit"),
          "equipment.view.list.reloadtime":
            checkL10nNonEmptyString ("equipment.view.list.reloadtime"),
          "equipment.view.list.reloadtimeunit":
            checkL10nNonEmptyString ("equipment.view.list.reloadtimeunit"),
          "equipment.view.list.range":
            checkL10nNonEmptyString ("equipment.view.list.range"),
          "equipment.view.list.ammunition":
            checkL10nNonEmptyString ("equipment.view.list.ammunition"),
          "equipment.view.list.pro":
            checkL10nNonEmptyString ("equipment.view.list.pro"),
          "equipment.view.list.enc":
            checkL10nNonEmptyString ("equipment.view.list.enc"),
          "equipment.view.list.additionalpenalties":
            checkL10nNonEmptyString ("equipment.view.list.additionalpenalties"),
          "itemeditor.titleedit":
            checkL10nNonEmptyString ("itemeditor.titleedit"),
          "itemeditor.titlecreate":
            checkL10nNonEmptyString ("itemeditor.titlecreate"),
          "itemeditor.options.number":
            checkL10nNonEmptyString ("itemeditor.options.number"),
          "itemeditor.options.name":
            checkL10nNonEmptyString ("itemeditor.options.name"),
          "itemeditor.options.price":
            checkL10nNonEmptyString ("itemeditor.options.price"),
          "itemeditor.options.weight":
            checkL10nNonEmptyString ("itemeditor.options.weight"),
          "itemeditor.options.carriedwhere":
            checkL10nNonEmptyString ("itemeditor.options.carriedwhere"),
          "itemeditor.options.gr":
            checkL10nNonEmptyString ("itemeditor.options.gr"),
          "itemeditor.options.grhint":
            checkL10nNonEmptyString ("itemeditor.options.grhint"),
          "itemeditor.options.improvisedweapon":
            checkL10nNonEmptyString ("itemeditor.options.improvisedweapon"),
          "itemeditor.options.improvisedweapongr":
            checkL10nNonEmptyString ("itemeditor.options.improvisedweapongr"),
          "itemeditor.options.template":
            checkL10nNonEmptyString ("itemeditor.options.template"),
          "itemeditor.options.combattechnique":
            checkL10nNonEmptyString ("itemeditor.options.combattechnique"),
          "itemeditor.options.primaryattribute":
            checkL10nNonEmptyString ("itemeditor.options.primaryattribute"),
          "itemeditor.options.primaryattributeshort":
            checkL10nNonEmptyString ("itemeditor.options.primaryattributeshort"),
          "itemeditor.options.damagethreshold":
            checkL10nNonEmptyString ("itemeditor.options.damagethreshold"),
          "itemeditor.options.damagethresholdseparated":
            checkL10nNonEmptyString ("itemeditor.options.damagethresholdseparated"),
          "itemeditor.options.damage":
            checkL10nNonEmptyString ("itemeditor.options.damage"),
          "itemeditor.options.damagedice":
            checkL10nNonEmptyString ("itemeditor.options.damagedice"),
          "itemeditor.options.bfmod":
            checkL10nNonEmptyString ("itemeditor.options.bfmod"),
          "itemeditor.options.weaponloss":
            checkL10nNonEmptyString ("itemeditor.options.weaponloss"),
          "itemeditor.options.reach":
            checkL10nNonEmptyString ("itemeditor.options.reach"),
          "itemeditor.options.reachshort":
            checkL10nNonEmptyString ("itemeditor.options.reachshort"),
          "itemeditor.options.reachmedium":
            checkL10nNonEmptyString ("itemeditor.options.reachmedium"),
          "itemeditor.options.reachlong":
            checkL10nNonEmptyString ("itemeditor.options.reachlong"),
          "itemeditor.options.atpamod":
            checkL10nNonEmptyString ("itemeditor.options.atpamod"),
          "itemeditor.options.structurepoints":
            checkL10nNonEmptyString ("itemeditor.options.structurepoints"),
          "itemeditor.options.length":
            checkL10nNonEmptyString ("itemeditor.options.length"),
          "itemeditor.options.parryingweapon":
            checkL10nNonEmptyString ("itemeditor.options.parryingweapon"),
          "itemeditor.options.twohandedweapon":
            checkL10nNonEmptyString ("itemeditor.options.twohandedweapon"),
          "itemeditor.options.reloadtime":
            checkL10nNonEmptyString ("itemeditor.options.reloadtime"),
          "itemeditor.options.rangeclose":
            checkL10nNonEmptyString ("itemeditor.options.rangeclose"),
          "itemeditor.options.rangemedium":
            checkL10nNonEmptyString ("itemeditor.options.rangemedium"),
          "itemeditor.options.rangefar":
            checkL10nNonEmptyString ("itemeditor.options.rangefar"),
          "itemeditor.options.ammunition":
            checkL10nNonEmptyString ("itemeditor.options.ammunition"),
          "itemeditor.options.pro":
            checkL10nNonEmptyString ("itemeditor.options.pro"),
          "itemeditor.options.enc":
            checkL10nNonEmptyString ("itemeditor.options.enc"),
          "itemeditor.options.armortype":
            checkL10nNonEmptyString ("itemeditor.options.armortype"),
          "itemeditor.options.stabilitymod":
            checkL10nNonEmptyString ("itemeditor.options.stabilitymod"),
          "itemeditor.options.armorloss":
            checkL10nNonEmptyString ("itemeditor.options.armorloss"),
          "itemeditor.options.zonesonly":
            checkL10nNonEmptyString ("itemeditor.options.zonesonly"),
          "itemeditor.options.movmod":
            checkL10nNonEmptyString ("itemeditor.options.movmod"),
          "itemeditor.options.inimod":
            checkL10nNonEmptyString ("itemeditor.options.inimod"),
          "itemeditor.options.additionalpenalties":
            checkL10nNonEmptyString ("itemeditor.options.additionalpenalties"),
          "zonearmor.actions.create":
            checkL10nNonEmptyString ("zonearmor.actions.create"),
          "zonearmoreditor.titleedit":
            checkL10nNonEmptyString ("zonearmoreditor.titleedit"),
          "zonearmoreditor.titlecreate":
            checkL10nNonEmptyString ("zonearmoreditor.titlecreate"),
          "zonearmoreditor.options.name":
            checkL10nNonEmptyString ("zonearmoreditor.options.name"),
          "zonearmoreditor.options.loss":
            checkL10nNonEmptyString ("zonearmoreditor.options.loss"),
          "zonearmoreditor.options.head":
            checkL10nNonEmptyString ("zonearmoreditor.options.head"),
          "zonearmoreditor.options.torso":
            checkL10nNonEmptyString ("zonearmoreditor.options.torso"),
          "zonearmoreditor.options.leftarm":
            checkL10nNonEmptyString ("zonearmoreditor.options.leftarm"),
          "zonearmoreditor.options.rightarm":
            checkL10nNonEmptyString ("zonearmoreditor.options.rightarm"),
          "zonearmoreditor.options.leftleg":
            checkL10nNonEmptyString ("zonearmoreditor.options.leftleg"),
          "zonearmoreditor.options.rightleg":
            checkL10nNonEmptyString ("zonearmoreditor.options.rightleg"),
          "info.equipment.rules":
            checkL10nNonEmptyString ("info.equipment.rules"),
          "info.weaponadvantage":
            checkL10nNonEmptyString ("info.weaponadvantage"),
          "info.weapondisadvantage":
            checkL10nNonEmptyString ("info.weapondisadvantage"),
          "info.armoradvantage":
            checkL10nNonEmptyString ("info.armoradvantage"),
          "info.armordisadvantage":
            checkL10nNonEmptyString ("info.armordisadvantage"),
          "pet.name":
            checkL10nNonEmptyString ("pet.name"),
          "pet.sizecategory":
            checkL10nNonEmptyString ("pet.sizecategory"),
          "pet.type":
            checkL10nNonEmptyString ("pet.type"),
          "pet.apspent":
            checkL10nNonEmptyString ("pet.apspent"),
          "pet.totalap":
            checkL10nNonEmptyString ("pet.totalap"),
          "pet.cou":
            checkL10nNonEmptyString ("pet.cou"),
          "pet.sgc":
            checkL10nNonEmptyString ("pet.sgc"),
          "pet.int":
            checkL10nNonEmptyString ("pet.int"),
          "pet.cha":
            checkL10nNonEmptyString ("pet.cha"),
          "pet.dex":
            checkL10nNonEmptyString ("pet.dex"),
          "pet.agi":
            checkL10nNonEmptyString ("pet.agi"),
          "pet.con":
            checkL10nNonEmptyString ("pet.con"),
          "pet.str":
            checkL10nNonEmptyString ("pet.str"),
          "pet.ap":
            checkL10nNonEmptyString ("pet.ap"),
          "pet.lp":
            checkL10nNonEmptyString ("pet.lp"),
          "pet.ae":
            checkL10nNonEmptyString ("pet.ae"),
          "pet.spi":
            checkL10nNonEmptyString ("pet.spi"),
          "pet.tou":
            checkL10nNonEmptyString ("pet.tou"),
          "pet.pro":
            checkL10nNonEmptyString ("pet.pro"),
          "pet.ini":
            checkL10nNonEmptyString ("pet.ini"),
          "pet.mov":
            checkL10nNonEmptyString ("pet.mov"),
          "pet.attack":
            checkL10nNonEmptyString ("pet.attack"),
          "pet.at":
            checkL10nNonEmptyString ("pet.at"),
          "pet.pa":
            checkL10nNonEmptyString ("pet.pa"),
          "pet.dp":
            checkL10nNonEmptyString ("pet.dp"),
          "pet.reach":
            checkL10nNonEmptyString ("pet.reach"),
          "pet.reachshort":
            checkL10nNonEmptyString ("pet.reachshort"),
          "pet.reachmedium":
            checkL10nNonEmptyString ("pet.reachmedium"),
          "pet.reachlong":
            checkL10nNonEmptyString ("pet.reachlong"),
          "pet.actions":
            checkL10nNonEmptyString ("pet.actions"),
          "pet.skills":
            checkL10nNonEmptyString ("pet.skills"),
          "pet.specialabilities":
            checkL10nNonEmptyString ("pet.specialabilities"),
          "pet.notes":
            checkL10nNonEmptyString ("pet.notes"),
          "avatarchange.title":
            checkL10nNonEmptyString ("avatarchange.title"),
          "avatarchange.actions.selectfile":
            checkL10nNonEmptyString ("avatarchange.actions.selectfile"),
          "avatarchange.actions.change":
            checkL10nNonEmptyString ("avatarchange.actions.change"),
          "avatarchange.dialog.image":
            checkL10nNonEmptyString ("avatarchange.dialog.image"),
          "avatarchange.view.invalidfile":
            checkL10nNonEmptyString ("avatarchange.view.invalidfile"),
          "fileapi.error.title":
            checkL10nNonEmptyString ("fileapi.error.title"),
          "fileapi.error.message.code":
            checkL10nNonEmptyString ("fileapi.error.message.code"),
          "fileapi.error.message.loadtables":
            checkL10nNonEmptyString ("fileapi.error.message.loadtables"),
          "fileapi.error.message.loadl10ns":
            checkL10nNonEmptyString ("fileapi.error.message.loadl10ns"),
          "fileapi.error.message.saveconfig":
            checkL10nNonEmptyString ("fileapi.error.message.saveconfig"),
          "fileapi.error.message.saveheroes":
            checkL10nNonEmptyString ("fileapi.error.message.saveheroes"),
          "fileapi.exporthero.title":
            checkL10nNonEmptyString ("fileapi.exporthero.title"),
          "fileapi.exporthero.success":
            checkL10nNonEmptyString ("fileapi.exporthero.success"),
          "fileapi.error.message.exporthero":
            checkL10nNonEmptyString ("fileapi.error.message.exporthero"),
          "fileapi.printcharactersheettopdf.title":
            checkL10nNonEmptyString ("fileapi.printcharactersheettopdf.title"),
          "fileapi.printcharactersheettopdf.success":
            checkL10nNonEmptyString ("fileapi.printcharactersheettopdf.success"),
          "fileapi.error.message.printcharactersheettopdf":
            checkL10nNonEmptyString ("fileapi.error.message.printcharactersheettopdf"),
          "fileapi.error.message.printcharactersheettopdfpreparation":
            checkL10nNonEmptyString ("fileapi.error.message.printcharactersheettopdfpreparation"),
          "fileapi.error.message.importhero":
            checkL10nNonEmptyString ("fileapi.error.message.importhero"),
          "fileapi.allsaved":
            checkL10nNonEmptyString ("fileapi.allsaved"),
          "fileapi.everythingelsesaved":
            checkL10nNonEmptyString ("fileapi.everythingelsesaved"),
          "emptylist":
            checkL10nNonEmptyString ("emptylist"),
          "musictraditions":
            checkL10nNonEmptyStringList ("musictraditions"),
          "dancetraditions":
            checkL10nNonEmptyStringList ("dancetraditions"),
          "notenoughap.title":
            checkL10nNonEmptyString ("notenoughap.title"),
          "notenoughap.content":
            checkL10nNonEmptyString ("notenoughap.content"),
          "reachedaplimit.title":
            checkL10nNonEmptyString ("reachedaplimit.title"),
          "reachedaplimit.content":
            checkL10nNonEmptyString ("reachedaplimit.content"),
          "reachedaplimit.advantages":
            checkL10nNonEmptyString ("reachedaplimit.advantages"),
          "reachedaplimit.disadvantages":
            checkL10nNonEmptyString ("reachedaplimit.disadvantages"),
          "reachedcategoryaplimit.title":
            checkL10nNonEmptyString ("reachedcategoryaplimit.title"),
          "reachedcategoryaplimit.content":
            checkL10nNonEmptyString ("reachedcategoryaplimit.content"),
          "reachedcategoryaplimit.magicaladvantages":
            checkL10nNonEmptyString ("reachedcategoryaplimit.magicaladvantages"),
          "reachedcategoryaplimit.blessedadvantages":
            checkL10nNonEmptyString ("reachedcategoryaplimit.blessedadvantages"),
          "reachedcategoryaplimit.magicaldisadvantages":
            checkL10nNonEmptyString ("reachedcategoryaplimit.magicaldisadvantages"),
          "reachedcategoryaplimit.blesseddisadvantages":
            checkL10nNonEmptyString ("reachedcategoryaplimit.blesseddisadvantages"),
          "modal.actions.add":
            checkL10nNonEmptyString ("modal.actions.add"),
          "modal.actions.remove":
            checkL10nNonEmptyString ("modal.actions.remove"),
          "modal.actions.cancel":
            checkL10nNonEmptyString ("modal.actions.cancel"),
          "removepermanentenergypoints.title":
            checkL10nNonEmptyString ("removepermanentenergypoints.title"),
          "removepermanentenergypoints.inputhint":
            checkL10nNonEmptyString ("removepermanentenergypoints.inputhint"),
          "name":
            checkL10nNonEmptyString ("name"),
          "group":
            checkL10nNonEmptyString ("group"),
          "sr.short":
            checkL10nNonEmptyString ("sr.short"),
          "sr.long":
            checkL10nNonEmptyString ("sr.long"),
          "check":
            checkL10nNonEmptyString ("check"),
          "ic.short":
            checkL10nNonEmptyString ("ic.short"),
          "ic.long":
            checkL10nNonEmptyString ("ic.long"),
          "ctr.short":
            checkL10nNonEmptyString ("ctr.short"),
          "ctr.long":
            checkL10nNonEmptyString ("ctr.long"),
          "primaryattribute.short":
            checkL10nNonEmptyString ("primaryattribute.short"),
          "primaryattribute.long":
            checkL10nNonEmptyString ("primaryattribute.long"),
          "at.short":
            checkL10nNonEmptyString ("at.short"),
          "at.long":
            checkL10nNonEmptyString ("at.long"),
          "pa.short":
            checkL10nNonEmptyString ("pa.short"),
          "pa.long":
            checkL10nNonEmptyString ("pa.long"),
          "aspect":
            checkL10nNonEmptyString ("aspect"),
          "mod.short":
            checkL10nNonEmptyString ("mod.short"),
          "mod.long":
            checkL10nNonEmptyString ("mod.long"),
          "property":
            checkL10nNonEmptyString ("property"),
          "unfamiliartraditions":
            checkL10nNonEmptyString ("unfamiliartraditions"),
          "spellextensions":
            checkL10nNonEmptyString ("spellextensions"),
          "liturgicalchantextensions":
            checkL10nNonEmptyString ("liturgicalchantextensions"),
          "enableeditingheroaftercreationphase":
            checkL10nNonEmptyString ("enableeditingheroaftercreationphase"),
          "allcombattechniques":
            checkL10nNonEmptyString ("allcombattechniques"),
          "newversionavailable.title":
            checkL10nNonEmptyString ("newversionavailable.title"),
          "newversionavailable.message":
            checkL10nNonEmptyString ("newversionavailable.message"),
          "newversionavailable.messagewithsize":
            checkL10nNonEmptyString ("newversionavailable.messagewithsize"),
          "newversionavailable.update":
            checkL10nNonEmptyString ("newversionavailable.update"),
          "nonewversionavailable.title":
            checkL10nNonEmptyString ("nonewversionavailable.title"),
          "nonewversionavailable.message":
            checkL10nNonEmptyString ("nonewversionavailable.message"),
          "downloadupdate":
            checkL10nNonEmptyString ("downloadupdate"),
          "mothertongue.short":
            checkL10nNonEmptyString ("mothertongue.short"),
          "attributeadjustmentselection":
            checkL10nNonEmptyString ("attributeadjustmentselection"),
          "mac.aboutapp":
            checkL10nNonEmptyString ("mac.aboutapp"),
          "mac.preferences":
            checkL10nNonEmptyString ("mac.preferences"),
          "mac.quit":
            checkL10nNonEmptyString ("mac.quit"),
          "edit":
            checkL10nNonEmptyString ("edit"),
          "view":
            checkL10nNonEmptyString ("view"),
          "rules.enableallrulebooks":
            checkL10nNonEmptyString ("rules.enableallrulebooks"),
          "races":
            checkL10nNonEmptyString ("races"),
          "cultures":
            checkL10nNonEmptyString ("cultures"),
          "professions":
            checkL10nNonEmptyString ("professions"),
          "advantages":
            checkL10nNonEmptyString ("advantages"),
          "disadvantages":
            checkL10nNonEmptyString ("disadvantages"),
          "skills":
            checkL10nNonEmptyString ("skills"),
          "combattechniques":
            checkL10nNonEmptyString ("combattechniques"),
          "specialabilities":
            checkL10nNonEmptyString ("specialabilities"),
          "spells":
            checkL10nNonEmptyString ("spells"),
          "cantrips":
            checkL10nNonEmptyString ("cantrips"),
          "liturgicalChants":
            checkL10nNonEmptyString ("liturgicalChants"),
          "blessings":
            checkL10nNonEmptyString ("blessings"),
          "items":
            checkL10nNonEmptyString ("items"),
          "allskillgroups":
            checkL10nNonEmptyString ("allskillgroups"),
          "allcombattechniquegroups":
            checkL10nNonEmptyString ("allcombattechniquegroups"),
          "allspecialabilitygroups":
            checkL10nNonEmptyString ("allspecialabilitygroups"),
          "allspellgroups":
            checkL10nNonEmptyString ("allspellgroups"),
          "allliturgicalchantgroups":
            checkL10nNonEmptyString ("allliturgicalchantgroups"),
          "allitemtemplategroups":
            checkL10nNonEmptyString ("allitemtemplategroups"),
          "wiki.chooseacategory":
            checkL10nNonEmptyString ("wiki.chooseacategory"),
          "wiki.initialmessage":
            checkL10nNonEmptyString ("wiki.initialmessage"),
          "emptylistnoresults":
            checkL10nNonEmptyString ("emptylistnoresults"),
        })
        (L10n)
    })

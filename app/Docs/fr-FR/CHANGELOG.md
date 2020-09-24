## 1.4.0

Please checkout the characters for which you've added SA *intuition tactique* or SA *détection des embuscades*. You'll notice it does not have it's previous name. This is due to an error (mentioned below) where the names of those two special abilities were swapped. The internal representation cannot change so the entries have to be "renamed". This should also fix the "incorrect" prerequisites of both entries.

### Features

- Italian translation [#667](https://github.com/elyukai/optolith-client/issues/667) [#610](https://github.com/elyukai/optolith-client/issues/610)
- Optional paper-style background for character sheet. [#36](https://github.com/elyukai/optolith-client/issues/36)
- Character Sheet view zoom option. [#665](https://github.com/elyukai/optolith-client/issues/665)
- Add/Subtract money from purse. [#666](https://github.com/elyukai/optolith-client/issues/666)
- Create custom advantages, disadvantages and special abilities with custom name and AP value (temporary solution). [#632](https://github.com/elyukai/optolith-client/issues/632)

### Enhancements

- Weight is now shown in an own column in equipment tab. [#305](https://github.com/elyukai/optolith-client/issues/305)
- Unnecessary combat sheets are not used anymore, it now depends on which armor the character has. It defaults to the normal armor if no armor is present. [#407](https://github.com/elyukai/optolith-client/issues/407)
- You can now click on entry names as well to show it's rules text. [#556](https://github.com/elyukai/optolith-client/issues/556)

### Bugs rectifiés

- Variants of profession *Blessed One of Boron* had wrong skill modifications. [#548](https://github.com/elyukai/optolith-client/issues/548)
- Profession *White Mage (Sword & Staff)* had a wrong AP value and an additional skill modification. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Fixed common professions of a culture will now be shown even if they are not from the **Core Rules**. [#563](https://github.com/elyukai/optolith-client/issues/563)
- The interface could be scaled down. [#487](https://github.com/elyukai/optolith-client/issues/487)
- Weapons of the combat technique *Lances* were not shown on character sheet. [#662](https://github.com/elyukai/optolith-client/issues/662)
- Attributes ignored the minimum caused by high skill ratings. The maximum of skill rating is the highest linked attribute&thinsp;+&thinsp;2, so the highest attribute is required to have a minimum value of SR&thinsp;&minus;&thinsp;2. [#630](https://github.com/elyukai/optolith-client/issues/630)
- The names for SA *intuition tactique* and SA *détection des embuscades* were swapped. [#636](https://github.com/elyukai/optolith-client/issues/636)
- The new application *Professional Publications* for skill *Law* had a wrong special ability prerequisite. [#680](https://github.com/elyukai/optolith-client/issues/680)
- Some list items were wider than the actual list. [#683](https://github.com/elyukai/optolith-client/pull/683)
- List headers were not centered by default. [#637](https://github.com/elyukai/optolith-client/issues/637)
- Permanently spent LP did not allow additional LP to be bought. [#606](https://github.com/elyukai/optolith-client/issues/606)
- Additional LP could not be added if CON is 8 and nothing depends on it. [#694](https://github.com/elyukai/optolith-client/issues/694)
- SA *Aspect Knowledge* did not show up even with three chants on SR 10 or higher. [#591](https://github.com/elyukai/optolith-client/issues/591)
- Cantrip Witch's Gaze was selectable by all spell casters. [#377](https://github.com/elyukai/optolith-client/issues/377)
- Updater checks and the check for updates button are now disabled on macOS since updates are not possible on macOS currently. [#589](https://github.com/elyukai/optolith-client/issues/589)
- Wrong applicable combat techniques for SA *Enemy Sense*. [#658](https://github.com/elyukai/optolith-client/issues/658)
- Auto-update alerts were enabled on Linux even when there were no direct auto-updates available. [#573](https://github.com/elyukai/optolith-client/issues/573)

### API

There are important and breaking changes coming with the next release, so if you use the Optolith source or save data, I'd recommend to come over to [Discord](https://discord.gg/wfdgB9g) so that I can tell you what is going to be changed in detail. Since more and more people depend on Optolith's data I will now follow semantic versioning strictly so that you can rely on the compatibility of source files just by checking out the version number. There will be a new format for heroes as well as for the source data. You can also give feedback on the changes, since they are not *completely* done yet &ndash; but I still think it would make sense to check out the changes as early as possible. The next major version is still a bit away, so you'll have plenty of time to adjust your software.

### Thank you

Last but definitely not least a big **Thank You** to the following people on GitHub who contributed to this release!

- [Jonas (@Rahjenaos)](https://github.com/Rahjenaos)
- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [manuelstengelberger (@manuelstengelberger)](https://github.com/manuelstengelberger)
- [Philipp A. (@flying-sheep)](https://github.com/flying-sheep)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.3.2

### Bugs rectifiés

- La description de la sélection des techniques de combat pour les variantes de professions n'est pas rendue correctement. #539
- Les professions ne tenaient pas compte des conditions prérequises. #507
- Le champ de texte "Titre" des données personnelles était mal renseigné. #492
- *Religion* avait une VC 6 pour la plupart des professions cléricales. #475
- Les États débordaient de la feuille de personnage en PDF mais pas dans Optolith. #473
- Le `config.json` a encore provoqué des erreurs pour de nombreux utilisateurs. Le problème devrait être réglé, finalement. #476
- Dans de très rares cas, des parties d'un fichier de héros ou la totalité d'un fichier de héros ont été effacées. C'est pour cette raison que la sauvegarde des héros a été complètement réécrite et condensée pour éviter d'autres problèmes. #477
- Rajout du dialecte Garethi manquant *Nostrien*. #480
- Rectification des licences tierces. #471
- Rectification des désavantages avec des options à choisir qui ne pouvaient pas être achetés. #470

### Known Issues

- Some of the entries with more complex prerequisites might *display* them wrong but *handle* them correct.

## 1.3.1

### Bugs rectifiés

- Dans la version française, vous ne pouviez pas créer de personnages, car vous ne pouviez choisir aucune publication, aucune race, ... #449
- Il y a eu une erreur due à des "clés inconnues" dans la configuration. #450
- Sur la feuille de personnage, les états n'étaient affichés dans une seule colonne que si le nombre d'états était pair. #448

## 1.3.0

Version initiale.

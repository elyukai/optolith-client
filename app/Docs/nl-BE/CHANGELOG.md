## 1.4.0

### Nieuwe features

- Italian translation [#667](https://github.com/elyukai/optolith-client/issues/667) [#610](https://github.com/elyukai/optolith-client/issues/610)
- Optional paper-style background for character sheet. [#36](https://github.com/elyukai/optolith-client/issues/36)
- Character Sheet view zoom option. [#665](https://github.com/elyukai/optolith-client/issues/665)
- Add/Subtract money from purse. [#666](https://github.com/elyukai/optolith-client/issues/666)
- Create custom advantages, disadvantages and special abilities with custom name and AP value (temporary solution). [#632](https://github.com/elyukai/optolith-client/issues/632)

### Verbeteringen

- Weight is now shown in an own column in equipment tab. [#305](https://github.com/elyukai/optolith-client/issues/305)
- Unnecessary combat sheets are not used anymore, it now depends on which armor the character has. It defaults to the normal armor if no armor is present. [#407](https://github.com/elyukai/optolith-client/issues/407)
- You can now click on entry names as well to show it's rules text. [#556](https://github.com/elyukai/optolith-client/issues/556)

### Probleemoplossingen

- Variants of profession *Blessed One of Boron* had wrong skill modifications. [#548](https://github.com/elyukai/optolith-client/issues/548)
- Profession *White Mage (Sword & Staff)* had a wrong AP value and an additional skill modification. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Fixed common professions of a culture will now be shown even if they are not from the **Core Rules**. [#563](https://github.com/elyukai/optolith-client/issues/563)
- The interface could be scaled down. [#487](https://github.com/elyukai/optolith-client/issues/487)
- Weapons of the combat technique *Lances* were not shown on character sheet. [#662](https://github.com/elyukai/optolith-client/issues/662)
- Attributes ignored the minimum caused by high skill ratings. The maximum of skill rating is the highest linked attribute&thinsp;+&thinsp;2, so the highest attribute is required to have a minimum value of SR&thinsp;&minus;&thinsp;2. [#630](https://github.com/elyukai/optolith-client/issues/630)
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

### Probleemoplossingen

- Beschrijving van gevechtstechnieken selectie voor beroepsvarianten wordt niet correct getoond. #539
- Beroepen reageerden niet correct op vereisten. #507
- Het tekstveld "Titel" in de persoonlijk data had een verkeerd label. #492
- *Goden & Kulten* was 6 voor de meeste Gewijde beroepen. #475
- Statussen waren te lang op je helden dokument PDF maar niet in Optolith. #473
- De `config.json` had nog altijd fouten voor veel gebruikers. Het probleem zou eindelijk opgelost moeten zijn. #476
- In hele zeldzame situaties werd de helden file geheel of gedeeltelijk verwijderd. Het saven van helden is geheel herschreven en compacter gemaakt om verdere problemen te voorkomen. #477
- Voeg het ontbrekende Garethi dialect *Nostrian* toe. #480
- Vereisten van de Competentie Energie Controle zijn aangepast. #471
- Derde parij licenties zijn aangepast. #471

### Bekende problemen

- Sommige elementen met complexe vereisten worden verkeerd getoont maar wel correct behandeld.

## 1.3.1

### Probleemoplossingen

- In de franse versie kon je geen helden maken, want je kon geen publicaties, ras, ... kiezen #449
- Er werd een error gemeld voor "unknown keys" in de config. #450
- Op je helden document werden staten enkel getoond in een enkele kolom als het aantal staten even was. #448

## 1.3.0

### Nieuwe features

- Franse versie (incl. Regelwerk) #34

### Verbeteringen

- Het zoekveld in de Wiki wordt niet langer gewist als men van categorie wisselt. #286
- Als het importeren van een held mislukt wordt nu gespecifieerd wat het probleem was (incompatibele versie, onbekend bestand, enz.) #343 #394
- Volledig nieuwe databankstructuur. Daardoor 50% snellere laadtijd.

### Probleemoplossingen

- De taaltabel vervormde de lay-out als Hjaldings/Saga-Thorwals actief was. #419
- De teksten bij de persoonlijke data op het heldendocument werden gedeeltelijk beknot. #413
- Het totale gewicht is nu gealigneerd op de het uitrustingsdocument. #291
- Een voorwerp kon niet worden opgenomen als geïmproviseerd wapen. #290
- De infotabel voor routineproeven was niet correct gealigneerd. #214
- Angst voor: keuze/eigen tekst werd niet getoond op het heldendocument. #213
- Men kon geen prenten importeren van een server als karaktertekening.  #229
- Het toevoegen van AP werkte niet als men het invoerveld niet verliet. #341
- Wapens die geen schade veroorzaken, tonen niet langer enkel D als schade. #353
- Geen talentvermindering op *Spoorzoeken* meer mogelijk bij jager (Premiejager). #357
- Com *Uithaal* toonde GtW Zwaarden dubbel. #355
- Een geëxporteerde held met een BOM kon niet worden gelezen. #37
- Veranderingen aan voorwerpen konden onder bepaalde omstandigheden niet worden bewaard.  #389
- Fout opgelost waarbij het veld "waar gedragen" niet bewaard werd bij voorwerpen. #369
- De maximale waarde voor gevechtstechnieken door de hoofdeigenschap werkt weer. #379
- Typo in ATTRIBUTO (Lichaamskracht), tweede uitbreiding verbeterd. #366
- De toepassingsconfiguratie veroorzaakt geen fouten meer. #358

## 1.2.0

Eerste Nederlandstalige versie.

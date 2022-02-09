## 1.5.0

### Features

* MapTool export ([87cec15](https://github.com/elyukai/optolith-client/commit/87cec15ba9751c329ee39719dc654895b9f4f193))
* Portuguese translations ([d8c9f52](https://github.com/elyukai/optolith-client/commit/d8c9f52542120f9e5fa569728b3f11cb79102365), [#676](https://github.com/elyukai/optolith-client/issues/676))
* Native Apple M1 support ([94e751f](https://github.com/elyukai/optolith-client/commit/94e751fda169c4de90cdb82346d3d864cf697300))

### Verbeteringen

* Security ([723e910](https://github.com/elyukai/optolith-client/commit/723e9106ebb178db6a7cccec2a022b3edaed5b98) and others)

### Probleemoplossingen

* Additional LE set a minimum required value of STR instead of CON ([390dcb6](https://github.com/elyukai/optolith-client/commit/390dcb616aaa68e5b103bb49dd75d1529c4e7e3a), [#787](https://github.com/elyukai/optolith-client/issues/787))
* Two-handed (2H) and improvised (i) weapon indicators were missing on character sheet ([3f9fae3](https://github.com/elyukai/optolith-client/commit/3f9fae30a2291b8e53486a74dae8cc1533741b94), [#797](https://github.com/elyukai/optolith-client/issues/797))
* Brawling weapons had no parry on character sheet ([a02700e](https://github.com/elyukai/optolith-client/commit/a02700eeccbd95a75f778d4d9e78ad7a2447dad8), [#1229](https://github.com/elyukai/optolith-client/issues/1229))
* An entry that depends on a single activation of another entry disables removing of all activations of that entry if multiple activations are present ([092343f](https://github.com/elyukai/optolith-client/commit/092343f45da566a45b13b275899a458fed720a76), [#1097](https://github.com/elyukai/optolith-client/issues/1097))
* Entries affecting spells to not be unfamiliar could be removed if Spell Enhancements were bought ([28f260a](https://github.com/elyukai/optolith-client/commit/28f260a2c4a96adb0d36585a478676f95c304414), [#827](https://github.com/elyukai/optolith-client/issues/827))
* The equipment info area may have crashed ([ae2fbad](https://github.com/elyukai/optolith-client/commit/ae2fbad1c738354dd468c1b36b06eda729a879e5))
* Professions that granted higher Combat Technique Ratings than what the selected Experience Level allowed were not filtered ([c8094f5](https://github.com/elyukai/optolith-client/commit/c8094f5ef15f62f69088386b9fc6c64f7d8bfd02), [#1244](https://github.com/elyukai/optolith-client/issues/1244))
* INI/MOV modifiers on armor were handled as penalties ([eb5a068](https://github.com/elyukai/optolith-client/commit/eb5a06884db1894e1a9f2b4b040b114cb4dc85cb), [#1091](https://github.com/elyukai/optolith-client/issues/1091))
* Language specializations did not always cost 1 AP and could not be activated multiple times for a single language ([0a59d9e](https://github.com/elyukai/optolith-client/commit/0a59d9e5e571e87525b18d0b25035e73f7cd87bf), [#1082](https://github.com/elyukai/optolith-client/issues/1082))
* Portraits with transparency had a black background ([cc5ecd6](https://github.com/elyukai/optolith-client/commit/cc5ecd6f098ae6c080eeb3b306887727a99c1220), [#800](https://github.com/elyukai/optolith-client/issues/800))
* Bornlander cultural package had Leatherworking instead of Prepare Food ([397abe2](https://github.com/elyukai/optolith-client/commit/397abe2b4a69582dc49422add1700807272c32d6), [#824](https://github.com/elyukai/optolith-client/issues/824))
* Primary attribute changes for items were not applied in edit window, only on character sheet ([6c63ab1](https://github.com/elyukai/optolith-client/commit/6c63ab1b5051882ace71f15740c3a69fff4a267f), [#798](https://github.com/elyukai/optolith-client/issues/798))
* Professions with due to EL impossible attribute values could be selected ([fdde329](https://github.com/elyukai/optolith-client/commit/fdde329de591319df3f6da11404dd7523d800c3e), [#1109](https://github.com/elyukai/optolith-client/issues/1109))
* Summoning spellworks from professions did not register dependencies from prerequisites ([c1b2e26](https://github.com/elyukai/optolith-client/commit/c1b2e267cb3f02d2d18812415c39c58739ad99ec), [#1240](https://github.com/elyukai/optolith-client/issues/1240))
* Typo in effect of Bliksemblind spell ([c58279c](https://github.com/elyukai/optolith-client/commit/c58279cc95aba5506824510d83aa6ffbc410107a), [#805](https://github.com/elyukai/optolith-client/issues/805))
* Weight of Elves was not generated correctly ([3b05e69](https://github.com/elyukai/optolith-client/commit/3b05e69e27f7faa1634b50eb134000fe1a2c3a21), [#813](https://github.com/elyukai/optolith-client/issues/813))
* Attributes on minimum value (8) did not allow a combat technique rating over 6 if the attribute was the combat technique's primary attribute ([47e66d6](https://github.com/elyukai/optolith-client/commit/47e66d65467999e2661eaac30a97b5a1ebfece94), [#835](https://github.com/elyukai/optolith-client/issues/835))
* Too large PDF output when using a sheet background ([9cb2658](https://github.com/elyukai/optolith-client/commit/9cb26586f3a5026d06f41801d4bbf714631d06a4), [#1094](https://github.com/elyukai/optolith-client/issues/1094))
* Auto-updater did not work in AppImage ([a24ff80](https://github.com/elyukai/optolith-client/commit/a24ff8082a5556fc07af05f113bacfd9c84428a4), [#753](https://github.com/elyukai/optolith-client/issues/753))
* Some primary attribute prerequisites were not enforced ([ac0cdc3](https://github.com/elyukai/optolith-client/commit/ac0cdc377800a1eb380993dbb7914fa88b8f254e), [#1260](https://github.com/elyukai/optolith-client/issues/1260))
* Range brackets input fields influenced other bracket fields ([0ab65e8](https://github.com/elyukai/optolith-client/commit/0ab65e869c26536127b386753db110f2e26b33af), [#1251](https://github.com/elyukai/optolith-client/issues/1251))
* Requiring only one matching languages and script required all of them instead ([4dabbdb](https://github.com/elyukai/optolith-client/commit/4dabbdbcd23c1ffeff18a8b1f9497a4a8315aa6a), [#1343](https://github.com/elyukai/optolith-client/issues/1343))
* Scripts did not require an active matching language ([1ed0c64](https://github.com/elyukai/optolith-client/commit/1ed0c64b0dd9873593169bd9994082d49299fa3e), [#1344](https://github.com/elyukai/optolith-client/issues/1344))
* Some item properties were not saved ([f2e6138](https://github.com/elyukai/optolith-client/commit/f2e61386abe444aa76f0211469d50c30fde99a0c), [#1252](https://github.com/elyukai/optolith-client/issues/1252))
* Unfamiliar spell selection in profession was optional ([3574d1b](https://github.com/elyukai/optolith-client/commit/3574d1ba46725d04a83286cd1055c080fe1de95f), [#1315](https://github.com/elyukai/optolith-client/issues/1315))
* Combat techniques did not influence the minimum of their primary attributes ([1ce2db9](https://github.com/elyukai/optolith-client/commit/1ce2db9cfbb06b1ca8a549957b8225af71de9185), [#836](https://github.com/elyukai/optolith-client/issues/836))
* Saving a hero cleared the undo history of multiple characters ([923b760](https://github.com/elyukai/optolith-client/commit/923b7605fee4c4288dc743e962728308f7254ca9), [#811](https://github.com/elyukai/optolith-client/issues/811))
* Widened rows in second column of skills table on character sheet ([41ee35b](https://github.com/elyukai/optolith-client/commit/41ee35ba76af42ad837daa6c45a940406b0c5daa), [#1342](https://github.com/elyukai/optolith-client/issues/1342))

### Dank u

Ten laatste maar zeker niet ten minste een dikke **Dank u** voor iedereen die feedback en help geeft in de verschillende kanalen alsook de volgende mensen op GitHub die bijgedragen hebben tot deze release!

- [Elidia (@FloraMayr)](https://github.com/FloraMayr)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lector (@Lector)](https://github.com/Lector)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [Marc Schwering (@m4rcsch)](https://github.com/m4rcsch)
- [Pepelios (@Pepelios)](https://github.com/Pepelios)

## 1.4.2

### Verbeteringen

- Start-up was trager dan in 1.3.2. [#751](https://github.com/elyukai/optolith-client/issues/751)

### Probleemoplossingen

- Gevechtstechnieken maximum GtR kon hoger zijn dan toegelaten. [#749](https://github.com/elyukai/optolith-client/issues/749)
- The top margin van overlay venters – zoals bij het toevoegen van Voordelen – was te klein. [#727](https://github.com/elyukai/optolith-client/issues/727)
- De P+T schade bonus werd niet toegevoegd aan wapens zonder extra schade. [#737](https://github.com/elyukai/optolith-client/issues/737)
- Beroep *Witte Magier (Gareth Academy van Zwaard en Staf)* van de **Basis regels** had een verkeerde AP waarde en *Astronomie 4* in plaats van *Alchemie 4*. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Dier vaardigheids tekst veld op de PDF export was te kort om alle relevante vaardigheden van een dier te bevatten. [#733](https://github.com/elyukai/optolith-client/issues/733)
- Afbeeldingen met uppercase file extensies werden niet aanvaard asl portret afbeeldingen. [#762](https://github.com/elyukai/optolith-client/issues/762)
- Het upload icon werd getoont in plaats van de portret afbeelding op het helden document als er geen portret opgeven was. [#759](https://github.com/elyukai/optolith-client/issues/759)
- Op de Mac, als de papier achtergrond aan stond, werden er additionele lege paginas toegevoegd aan de PDF output. [#748](https://github.com/elyukai/optolith-client/issues/748)

### Thank you

Ten laatste maar zeker niet ten minste een dikke **Dank u** voor iedereen die feedback en help geeft in de verschillende kanalen alsook de volgende mensen op GitHub die bijgedragen hebben tot deze release!

- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.4.1

### Probleemoplossingen

- Italiaans was niet beschikbaar.

## 1.4.0

### Nieuwe features

- Italiaanse vertaling [#667](https://github.com/elyukai/optolith-client/issues/667) [#610](https://github.com/elyukai/optolith-client/issues/610)
- Optionele papier-stijl achtergrond voor helden document. [#36](https://github.com/elyukai/optolith-client/issues/36)
- helden document zoom optie. [#665](https://github.com/elyukai/optolith-client/issues/665)
- Geld toevoegen/aftrekken. [#666](https://github.com/elyukai/optolith-client/issues/666)
- Voeg Voordelen, Nadelen en Competenties op maat toe met gekozen naam en AP waarde (tijdelijke oplossing) [#632](https://github.com/elyukai/optolith-client/issues/632)

### Verbeteringen

- Gewicht wordt nu in zijn eigen kolom getoond in de uitrusting tab. [#305](https://github.com/elyukai/optolith-client/issues/305)
- Onnodige gevechtsdocumenten worden niet meer gebruikt, het hangt nu af van welke wapenrusting de held heeft. Het gaat standaard naar de normale wapenrusting als er geen wapenrusting aanwezig is. [#407](https://github.com/elyukai/optolith-client/issues/407)
- Je kan nu ook klikken op namen om de regeltekst te zien. [#556](https://github.com/elyukai/optolith-client/issues/556)

### Probleemoplossingen

- Varianten van het beroep *Gewijde van Boron* had verkeerde talent aanpassingen. [#548](https://github.com/elyukai/optolith-client/issues/548)
- Beroep *Witte Tovenaar (Zwaard & Staf)* had een verkeerde AP waarde and een extra talent aanpassing. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Vaste veelvoorkomende beroepen van een kultuur zullen nu getoond worden zelfs al zijn de ze niet van de **Basis Regels**. [#563](https://github.com/elyukai/optolith-client/issues/563)
- The interface kon kleiner gemaakt worden. [#487](https://github.com/elyukai/optolith-client/issues/487)
- Wapens van de gevechtscompetentie *Lans* werden niet getoond op het helden document. [#662](https://github.com/elyukai/optolith-client/issues/662)
- Goede Eigenschappen negeerden het minimum veroorzaakt door hoge talent waarden. De maximum van een talent waarde is het hoogste gerelateerde goede eigenschap&thinsp;+&thinsp;2, dus een goede eigenschap moet een minimum waarde hebben van de hoogste talent waarde &thinsp;&minus;&thinsp;2. [#630](https://github.com/elyukai/optolith-client/issues/630)
- Het nieuwe toepassingsgebeird *Professionele Publicaties* voor het talent *Wet* had een verkeerde Competentie vereiste. [#680](https://github.com/elyukai/optolith-client/issues/680)
- Sommige lijst elementen werden breder dan de eigenlijke lijst.  [#683](https://github.com/elyukai/optolith-client/pull/683)
- Lijst hoofdingen werden niet automatisch gecentreerd. [#637](https://github.com/elyukai/optolith-client/issues/637)
- Permantent gespendeerde LP lieten niet toe om extra LP te kopen. [#606](https://github.com/elyukai/optolith-client/issues/606)
- Extra LP konden niet worden gekocht als CO 8 was en er niets van afhing. [#694](https://github.com/elyukai/optolith-client/issues/694)
- Competentie *Aspect Kennis* verscheen niet, zelfs met drie liturgieen op talent waarde 10 of hoger. [#591](https://github.com/elyukai/optolith-client/issues/591)
- Tovertruuk Heksenblik kon worden geselecteerd door alle Tovenaars. [#377](https://github.com/elyukai/optolith-client/issues/377)
- Updater tests en de test voor de update knop zijn nu uitgeschakeld op MacOS want updates zijn momenteel niet mogelijk op MacOS. [#589](https://github.com/elyukai/optolith-client/issues/589)
- Verkeerde toegepaste gevechtscompetentie voor Competentie Vijand Waarnemen. [#658](https://github.com/elyukai/optolith-client/issues/658)
- Auto-update waarschuwingen werden aangezet op Linux, zelfs al was er geen direct auto-update beschikbaar. [#573](https://github.com/elyukai/optolith-client/issues/573)
- Het dialoogvenster voor het exporteren van een teken, omdat JSON de bestandsextensie niet heeft toegevoegd aan de voorgestelde bestandsnaam. [#718](https://github.com/elyukai/optolith-client/issues/718)

### API

Er komen belangijke en brekende veranderingen aan met de volgende release, dus als je Optolith source of data gebruikt, raad ik je aan om naar de [Discord](https://discord.gg/wfdgB9g) te komen zodat ik je in detail kan uitleggen wat er gaat veranderen. Vermits meer en meer mensen afhankelijk zijn van Optolith's data zal ik nu strict versiebeheer volgen zodat je op de compatibiliteit van de sources kan rekenen door het versie nummer te controleren. Er zal een nieuw formaat komen voor de helden en de bron data. Je kan ook feedback geven op de veranderingen, vermits ze nog niet *helemaal* volledig zijn &ndash; maar ik denk dat het zinnig zou zijn om de verandering zo snel mogelijk na te kijken. De volgende versie duurt nog wel even, zodat je voldoende tijd hebt om je software aan te passen.

### Thank you

Tenslotte, maar zeker niet tenminste, een dikke **Dankuwel** voor de volgende mensen op GitHub die bijgedragen hebben tot deze release!

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

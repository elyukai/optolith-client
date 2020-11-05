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

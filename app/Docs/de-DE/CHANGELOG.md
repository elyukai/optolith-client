## 1.3.0

### Neue Features

- Französische Version (inkl. Regelwerk) #34
- Aventurische Magie 2 #41
- Aventurisches Kompendium 2 #93

### Verbesserungen

- Das Suchfeld im Wiki wird jetzt nicht mehr gelöscht, wenn man die Kategorie wechselt. #286
- Wenn der Import eines Helden fehlschlägt, werden nun genauere Infos gegeben, was genau das Problem war. (inkompatible Version, invalide Datei, etc.) #343 #394
- Komplett neuer Datenbankunterbau und dadurch Ladezeitersparnis von ca. 50%

### Fehlerbehebungen

- Der Cache für AP funktioniert jetzt wieder ordnungsgemäß, wenn man nicht alle Helden speichert. #416
- Die Sprachtabelle verzerrte das Layout, wenn Hjaldisch/Saga-Thorwalsch aktiv war. #419
- SF *Zugvögel*: Statt Rahjaliturgien standen Travialiturgien zur Auswahl. #423
- Die Texte bei den persönliche Daten auf dem Heldenbogen wurden teilweise beschnitten. #413
- Die Profession *Schwarzmagier (Schüler des Demirion Ophenos)* hatte falsche AP-Kosten. #344
- Die Ausrichtung des Gesamtgewichts auf dem Besitz-Bogen wurde behoben. #291
- Ein Gegenstand konnte nicht als improvisierte Waffe eingetragen werden. #290
- SF *Jägerinnen der weißen Maid*: Mögliche Liturgien zeigten keine Aspekte an. #289
- Die Infotabelle für Routineproben war nicht richtig ausgerichtet. #214
- Angst vor: Auswahl/eigener Text wurde auf dem Heldenbogen nicht angezeigt. #213
- Man konnte keine Bilder von einem Server als Bild importieren. #229
- Das Hinzufügen von AP funktionierte nicht, wenn man nicht das Eingabefeld verlassen hat. #341
- Waffen, die keinen Schaden verursachen, zeigen nicht mehr nur "W" als Schaden. #353
- Keine Talentwertverringerung *Fährtensuche* mehr möglich bei Jäger (Kopfgeldjäger). #357
- SF *Vorstoß* hatte KT Schwerter doppelt aufgeführt. #355
- Ein exportierter Held mit einer BOM konnte nicht gelesen werden. #37
- Gegenstandsänderungen konnten in bestimmten Situationen nicht gespeichert werden. #389
- Fehler behoben, dass das Feld "Wo getragen?" bei Gegenständen nicht gespeichert wurde. #369
- Die Zaubertricks Hexenblick und Elfenhaar sind jetzt nur noch für Hexen bzw. Elfen wählbar. #377
- Die Obergrenze durch die Leiteigenschaft bei Kampftechniken funktioniert jetzt wieder. #379
- Typo in ATTRIBUTO (Körperkraft), zweite Erweiterung behoben. #366
- Wurfnetz war bei *Schleudern* anstelle bei *Wurfwaffen* hinterlegt. #345
- Typo im Text der SF *Abrichter* behoben. #342
- Die Anwendungskonfiguration wirft jetzt keine Fehler mehr hervor. #358

### API

Es gibt auf [GitHub](https://github.com/elyukai/optolith-client/tree/master/app/Schema/Hero) jetzt ein einfaches Schema zum Validieren eines Helden. Ein vollständiges Schema ist in Arbeit; die unfertige Version davon findet sich ebenfalls im verlinkten Ordner.

## 1.2.0

Diese Release ist hauptsächlich für andere Sprachen, da es Optolith jetzt auch auf Niederländisch gibt und English an Büchern aufgeholt hat. Allerdings gibt es auch viele relevante Fehlerbehebungen und kleine Verbesserungen.

### Neue Features

- Niederländische Version (inkl. Regelwerk)
- Neue Bücher auf Englisch

### Verbesserungen

- Schilde werden normalerweise nicht als Primärwaffe genutzt, weshalb der doppelte Paradebonus nun standardmäßig auf dem Heldenbogen eingerechnet wird und nicht mehr der einfache.
- Verbessertes Ausweichen I–III erhöht AW nicht mehr, da dies nur passieren darf, wenn man keine Rüstung trägt.
- *Saga-Thorwalsch* in *Hjaldinsch/Saga-Thorwalsch* umbenannt.
- SF Variante (beide) in *Zaubererweiterung* und *Liturgieerweiterung* umbenannt.

### Fehlerbehebungen

- Die Optionalregel *Höhere Paradewerte* erhöhte AW um 2 bzw. 4, obwohl es eigentlich nur 1 bzw. 2 sind.
- Eine Zauber der Tradition (Scharlatan) hatten diese nicht als Tradition eingetragen.
- Vorteil *Leichter Gang* hat die GS nicht erhöht.
- Nachteil *Pech I-III* hat die maximalen SchiPs auf dem Heldenbogen nicht verringert.
- Das Fenster für permanent ausgegebene Astralenegie und Karmaenergie war nicht schließbar.
- Nachteil *Stigma (Grüne Haare)* ändert die Haarfarbe jetzt auf Grün.
- Die Bildvorschau zeigt jetzt auch PNGs und nicht mehr nur JPEGs an.
- Muttersprache (MS) konnte nicht als Stufe für Sprachen selektiert werden.
- Der Schließen-Button des App-Fensters funktionierte nicht.
- Fehlermeldungen beim Import-/Export-Abbruch entfernt.
- SERPENTIALIS ist jetzt für Hexen und nicht mehr für Elfen.
- Feenpaktgeschenke haben jetzt Beschreibungen.
- Persönlichkeitsschwäche: Es ist jetzt möglich, so viele Vorurteil/Weltfremd-Einträge zu kaufen wie man möchte.
- Für Professionen erforderliche Eigenschaftswerte werden jetzt auch so eingetragen.
- SF Merkmalskenntnis funktionierte nicht und hatte eine falsche Kostenberechnung.
- Halbgötter waren nicht als Anwendungsgebiete für *Götter & Kulte* verfügbar.
- Fehlende Heilkräuter hinzugefügt.
- Das Neuauswürfeln des Gewichts ohne eine bereits eingetragene Größe geht nun nicht mehr von einer Größe von 0 aus, sondern würfelt erst die Größe neu aus und lässt diesen Wert dann in das Gewicht einfließen.
- Wenn die KK 8 ist, ist die Tragkraft nicht mehr 0 sondern 16.
- Kampftechnikanpassungen in Professionsvarianten wurden nicht korrekt dargestellt.
- Der Standardname für einen exportierten Heldenbogen ist jetzt der Name des Helden.
- Das Maximum für Fremdzauber griff auch noch nach der Heldenerstellung.
- Helden, die von der aktuell ausgeführten Optolith-Version nicht unterstützt werden, werden nicht mehr geladen bzw. angezeigt.
- SF Athlet: Falsche Voraussetzungen
- SF Buchdrucker: Falsche Voraussetzungen
- Wenn ein Zauber für die Tradition Gildenmagier ausgewählt werden soll, werden Zauber der Tradition Allgemein ausgeblendet.
- Umlautzeichen in Listenelementen werden jetzt nicht mehr abgeschnitten.
- Die gewählte Sprache eines Helden wurde nicht gespeichert.
- Pakte wurden nicht gespeichert.
- SF Kupferstich: Falsche Voraussetzungen
- Das Feld *Verbreitung* hat die Tradition (Namenloser) nicht aufgeführt.
- Zu lange Liturgienamen werden auf dem Heldenbogen jetzt als Abkürzung dargestellt.
- Die Liturgietabelle auf dem Liturgiebogen hatte teilweise falsche Überschriften.
- Bann-/Schutzkreise werden auf dem Heldenbogen jetzt korrekt angezeigt.
- Erweiterte Liturgiesonderfertigkeiten wurden häufig nicht durch Liturgiestile freigeschaltet.
- Nachteil *Unfähig* hatte den Vorteil *Begabung* als Ganzes verboten und nicht nur das jeweilige Talent.
- Das Maximum von Kampftechniken durch die Leiteigenschaft greift jetzt auch während der Heldenerstellung.
- Hat man die Tradition Meistertalentierte ausgewählt, wurden die in Vorteile und Nachteile ausgegebenen AP nicht angezeigt.
- SF Lieblingszauber erlaubt jetzt das Auswählen inaktiver Zauber nicht mehr.
- Der Anteil der Kopfrüstung und der Torsorüstung bei Zonenrüstung war vertauscht.
- SF Baliho-Stil hatte Schilddeckung als mögliche erweiterte Kampfsonderfertigkeit aufgezählt, obwohl es Schildstoß hätte sein müssen.

## 1.1.2

### Verbesserungen

- Die Meldung beim Laden ist jetzt auf Deutsch.
- Das Abschließen der SKP-Auswahl kann jetzt rückgängig gemacht werden.

### Fehlerbehebungen

- Kampfsonderfertigkeiten zeigen jetzt wieder ihren Typ (passiv/Basismanöver/Spezialmanöver) im Wiki an.
- Zauber nach Gruppe zu sortieren sortiert die Gruppen jetzt alphabetisch.
- Auf EG *Unerfahren* kann mal als Gildenmagier jetzt auch den ausgewählten Fremdzauber (der jetzt keiner mehr ist) auswählen.
- In der Auswahlliste für SF *Tradition (Gildenmagier)* werden jetzt keine traditionseigenen Zauber mehr angezeigt.
- Das englische User Interface lädt jetzt wieder ohne Probleme.
- Profession *Akademie von Licht und Dunkelheit* kann jetzt wieder ohne UI-Fehler ausgewählt werden.

## 1.1.0/1.1.1

*Die genaue Versionsnummer der App ist 1.1.1.*

Nach mehr als über einem Jahr kommt nun endlich ein großes Update – auch wenn man es als Benutzer nicht unbedingt mitbekommt: Optolith hat einen komplett neuen Code bekommen. Mit einher geht eine interne Umstrukturierung, sodass Features wie Gruppen in Zukunft performant möglich sein werden. Das ist zwar die größte Änderung, aber nicht die einzige: Sämtliche gemeldeten Bugs sind behoben und über die letzten zwei Wochen haben meine Tester auch noch diverse Bugs gefunden, die hiermit auch behoben werden.

Vermutlich werdet ihr feststellen, dass Optolith ein paar Sekunden länger braucht zum Laden als vorher. Das liegt daran, dass ich Optolith neu gebaut habe mit dem Grundgedanken, dass es stabiler läuft. Ich führe daher beim Laden Prüfungen durch, damit alle Daten, die geladen werden, auch wirklich so aussehen wie erwartet und nicht durch falsche Tabellen oder andere Daten etwas im Programm passiert, was nicht beabsichtigt ist. Die Start-Performance wird definitiv noch verbessert werden, für den Anfang ist mir ein stabileres Programm aber lieber als ein schnelles; schließlich geht es hier auch nur um den Programmstart, die Performance bei der Benutzung ist davon nicht betroffen.

Nicht zuletzt aber auch ein bereits an anderer Stelle erwähntes großes Dankeschön an euch, für eure Geduld und euer ganzes Feedback und weitere Hilfe, ohne die ich nicht all die Fehler hätte beheben können. Zwar haben es neue Regelwerke noch nicht in diese Version geschafft, und auch die nächste Version wird nicht alle neuen beinhalten, aber dennoch wird Optolith jetzt vergleichsweise schnell auf den aktuellen Stand der Regeln kommen können.

Aber nun zum Changelog dieser Version:

### Neue Features

- Helden können über die Heldenliste nun direkt gespeichert werden.
- Portraits von Helden und Begleitern können jetzt auch wieder gelöscht werden.

### Verbesserungen

- Auswahllisten werden nach aktivierten Regelwerken gefiltert. Das funktionierte vorher nur für die Hauptlisten wie Sonderfertigkeiten, jetzt aber eben auch für z. B. die Liste von Berufsgeheimnissen.
  - Wikieinträge können nicht nach bestimmten Regelwerken gefiltert werden; ebenso wenig wie diese bei geöffneten Helden nach den dort gewählten Regelwerken gefiltert werden. Dies wird noch nachgereicht!
- Fremdzauber werden jetzt wie untypische Vorteile durch eine rote Einfärbung markiert.
- Die Suche nach Professionen durchsucht jetzt auch Professionsvarianten.
- Auf dem Heldenbogen ist jetzt für doppelt so viele Sprachen Platz.
- Beim Hinzufügen von Vor-/Nachteilen werden jetzt sowohl die AP für Vorteile als auch für Nachteile angezeigt.
- Schilde werden auf dem Heldenbogen jetzt sowohl als Schild als auch als Waffe eingetragen.
- Texte des Wikis können jetzt selektiert und dadurch kopiert werden.
- Für die *Tradition (Gildenmagier)* muss jetzt ein Fremdzauber festgelegt werden. **Für eine bereits aktivierte SF funktioniert dies im *Regeln*-Tab! Bitte stellt dies ein, weil es für kommende Regelwerke relevant ist!**
- Um später besser auf Unterschiede von Versionen in verschiedenen Sprachen reagieren zu könne, wird zu den Helden ab jetzt auch die Sprache gespeichert, in der der Held erstellt wurde. **Für ältere Helden wird diese auf die aktuell eingestellte Sprache eingestellt. Zum Ändern müsst ihr in den *Regeln*-Tab wechseln! Bitte stellt dies ein, weil es in kommenden Versionen relevant wird!**
- Im Profil wird jetzt angezeigt, wie sich die zufällige Generierung für Gewicht und Größe zusammensetzt.
- Der Dialog, der beim Schließen auftaucht, wenn ungespeicherte Aktionen vorhanden sind, ist jetzt klarer formuliert und hat jetzt drei Buttons für alle drei Optionen.
- Text auf dem Heldenbogen kann jetzt selektiert werden. Diese Option ist aber nicht dazu geeignet, um den gesamten Heldenbogen zu kopieren, weil das Layout nicht richtig übernommen wird.
- Den FAQ wurde der Eintrag hinzugefügt, wie man LE/AE/KE hinzufügt.
- Wenn man den Wikieintrag für einen Eintrag außerhalb des Wikis angezeigen lässt, wird der Listeneintrag wie im Wiki hervorgehoben.
- Beim Pakt wird angezeigt, wenn Felder fehlen, die ausgefüllt werden müssen, um einen vollständigen Pakt zu erhalten.
- Die AP, die beim Beenden der Heldenerschaffung maximal übrig sein dürfen, betragen jetzt immer 10 AP, egal in welchem Modus man sich befindet.
- Einsatzmöglichkeiten für Talente hinzugefügt.
- Bei Talenten, bei denen die Einrechnung der Belastung nicht eindeutig ist, wird im Wikieintrag jetzt die komplette Beschreibung angezeigt, wann die Belastung relevant ist und wann nicht.
- Die einzelnen Einträge für Vorteil *Herausragender Sinn* und Nachteil *Eingeschränkter Sinn* wurden zusammengefügt.
- Unter *Ergänzende Quellen* werden in Wikieinträgen von Vorteilen, Nachteilen und Sonderfertigkeiten jetzt die Quellen genannt, von denen die jeweiligen Einträge ihre Auswahlmöglichkeiten bekommen. Z. B. wird bei Berufsgeheimnissen dann nicht nur die eigentliche SF aus dem Basisregelwerk als Quelle genannt, sondern eben auch die Quellen weiterer Berufsgeheimnisse auch anderen Büchern.
- Analog zur geweihten Variante des Rabenschnabels gibt es jetzt die im Regelwerk beschriebene profane Variante des Rabenschnabels zum dort genannten Preis von 90 S. Außer des Status *geweiht/nicht geweiht* unterscheiden sich die Gegenstände nicht.
- Die dargstellte Formel zur Berechnung der Astralenergie passt sich jetzt entsprechend der Tradition an. Denn bei einigen Traditionen fließt nur die Hälfte der Leiteigenschaft ein und einige haben keine Leiteigenschaft, die einfließen könnte.
- Bei Stabzaubern wird *Bindung des Stabes* als Voraussetzung ausgeblendet.

### Fehlerbehebungen

- Nach einem Wechsel von Deutsch zu Englisch konnten Charaktere nicht mehr bearbeitet werden.
- Sonderfertigkeiten können wieder nach Gruppen sortiert werden.
- Verbreitung von Liturgien wird jetzt alphabetisch sortiert.
- Fertigkeits- und Kampftechnik-Maxima werden bei der Erstellung nun auch von den Probeneigenschaften bzw. Leiteigenschaften beeinflusst.
- Hesindegeweihter: Sternkunde 4 anstelle von Alchimie 4.
- FAQ: Zwei Typos korrigiert.
- *Meistertalentierte* können keine Zauber mehr kaufen.
- Gelb hervorgehobene Vorteile/Nachteile werden jetzt auch in der Legende erklärt.
- Ein/e durch eine Professionsvariante entfernte/r Zauber/Liturgie der Basisprofession wird jetzt auch wirklich entfernt und nicht mehr auf FW 0 aktiviert.
- Fehlende Professionsvarianten für Profession *Wildniskundiger* hinzugefügt.
- Fehlende Berufsgeheimnisse aus dem **Aventurischen Kompendium I** hinzugefügt.
- Bilder werden auf Linux wieder angezeigt.
- Automatische Vorteile haben jetzt Kosten von 0 AP, sodass Spezieskosten wieder korrekt sind.
- Das Sortieren von Ausrüstung nach Gruppen wirft keinen Fehler mehr.
- Das Portrait von Begleitern wird nun beim Export auch mit exportiert.
- Details für Zauber und Liturgien werden wieder auf dem Heldenbogen angezeigt.
- *Intuitive Zauberer* haben keinen Zugriff mehr auf Rituale und Zauber des Steigerungsfaktors D.
- „Steigerungskosten“ → „Steigerungsfaktor“.
- Astralenergie wird beim *Gildenmagier aus Perricum* wieder richtig berechnet.
- Die Voraussetzung „Spezies, Kultur oder Profession muss \[...] als automatischen oder empfohlenen \[Vorteil/Nachteil] aufweisen“ berücksichtigt jetzt auch wieder automatische Vorteile der Spezies, sollten diese entfernt worden sein.
- Liturgiestile werden jetzt beim Charakterwechsel auch korrekt übernommen, sodass keine Zulassungen durch vorherige Stile mehr relevant sind.
- Begleiterlayout auf dem Heldenbogen ist jetzt wieder korrekt.
- Bei der PDF ist jetzt kein Scrollbalken mehr zu sehen.
- Ein valider Pakt wirft bei Sonderfertigkeiten keinen Fehler mehr.
- Bann-/Schutzkreise werden wieder auf dem Heldenbogen angezeigt.
- Beim Senken von Eigenschaften im Editor-Modus werden nun hinzugekaufte LE/AE/KE berücksichtigt und verhindern ggf. das Senken.
- *Intuitive Zauberer* behandeln jetzt alle Zauber als Zauber ihrer Tradition.
- Manchmal wurde im Wikieintrag von Professionen anstelle eines Wertes, z. B. bei *Ehrenhaftigkeit 6*, `null` angezeigt, sodass dort dann *Ehrenhaftigkeit null* stand.
- Manchmal wurde der im Wikieintrag angezeigte vorherige Wert von durch Professionsvarianten veränderte Wert um 6 erhöht. Beispiel Profession Ritter: *Etikette 2 statt 12* ist eigentlich *Etikette 2 statt 6*.
- Vorteil *Herausragende Fertigkeit* funktioniert jetzt auch wieder für Zauber.
- Vorteil *Koboldfreund* fehlte.
- Nachteil *Kleine Zauberauswahl* ist wieder für *Intuitive Zauberer* verfügbar.
- Nachteil *Lästige Blütenfeen* fehlte.
- Nachteil *Schlechte Eigenschaft (Geiz)* und *(Verschwendungssucht)* haben sich nicht ausgeschlossen.
- Im Eingabefeld für Nachteil *Prinzipientreue* steht jetzt „Prinzip“ und nicht mehr „Prinzipie“.
- Zauber und Liturgien sind jetzt nicht mehr im Nachteil *Unfähig* enthalten. Bei Helden, die dies hatten, wird der Nachteil automatisch entfernt.
- Das Kaufen des Nachteils *Wenige Visionen* wirft keinen Fehler mehr.
- SF *Adaption (Zauber)* wird jetzt angezeigt, wenn die Voraussetzungen erfüllt sind.
- SF *Adaption (Zauber)* exkludiert jetzt Fremdzauber.
- SF *Aspektkenntnis* kann wieder problemlos hinzugefügt werden.
- SF *Astralraub*: Leerzeichen fehlte.
- SF *Böser Namensvetter*, *Lächerlicher Name*, *Schurkenname*, *Unpassender Name*: Nicht mehr als Elf wählbar.
- SF *Böser Namensvetter*: Formatierung korrigiert.
- SF *Buchdrucker*: Voraussetzung Stoffbearbeitung 4 → Mechanik 4.
- SF *Eisenhagel* kann wieder gekauft werden.
- SF *Gebieter des \[Aspekts\]* wird jetzt wieder angezeigt, wenn die Voraussetzungen dafür erfüllt werden.
- SF *Kupferstich*: Voraussetzung Lebensmittelbearbeitung 4 → Malen & Zeichen 4.
- SF *Macht der Namenlosen Klinge* ist jetzt wieder in allen 13 Stufen auswählbar, natürlich vorausgesetzt, dass die Voraussetzungen erfüllt sind.
- SF *Merkmalskenntnis* kann wieder problemlos hinzugefügt werden.
- SF *Präziser Schuss/Wurf* hatte falsche Eigenschaftsvoraussetzungen.
- SF *Scharfschütze II*: Voraussetzung ist jetzt IN 17 statt IN 15.
- SF *Siegelbrecher*: Merkmal Hellsicht → Merkmal Antimagie.
- SF *Verschwinde!*: AsP-Kosten und Volumen ergänzt.
- Die Nachteile *Keine Flugsalbe* und *Kein Vertrauter* verringern nun korrekt die Kosten der SF *Tradition (Hexen)*.
- SF *Tradition (Gildenmagier)* wird jetzt bei der Fremdzauberbegrenzung berücksichtigt (siehe dazu auch die Änderung an der Tradition weiter oben).
- SF *Volumenerweiterung des Bannschwerts*: AsP-Kosten ergänzt.
- *Bekehren & Überzeugen*: Probe MU/IN/CH → MU/KL/CH.
- *Etikette*, Belastung: Evtl. → Nein.
- *Fahrzeuge*: Unter **Werkzeuge** fehlte *Fahrzeug*.
- *Tanzen*, misslungene Probe: Vorher war dort der Text von *Sinnesschärfe*.
- *Verkleiden*, Belastung: Evtl. → Ja.
- Falsche Probeneigenschaften von Zaubern/Magischen Handlungen:
  - *Friedenslied*: MU/KL/IN → MU/IN/CH
  - *Sorgenlied*: MU/CH/CH → MU/IN/IN
  - *Zaubermelodie*: MU/KL/CH → MU/IN/CH
- Text, dass ein bestimmter Aspekt eines Zaubers nicht modifiziert werden kann, fehlt:
  - MOTORICUS: Kosten
  - MOVIMENTO: Wirkungsdauer
  - NEBELWAND: Kosten
- Fehlende Probenmodifikatoren (SK/ZK) bei Zaubern hinzugefügt.
- ADLERAUGE: Tradition Druiden ergänzt, AMA1-Quelle ergänzt.
- ANALYS ARKANSTRUKTUR: Zauberdauer 2 Aktionen → 32 Aktionen.
- ATTRIBUTO für Mut, Fingerfertigkeit, Gewandheit und Konstitution beinhaltet nun auch die Wirkungen der einzelnen QS.
- BAND UND FESSEL – Zaubererweiterungen: Wortdopplung korrigiert.
- DUNKELHEIT – Zaubererweiterungen: Leerzeichen fehlten.
- FULMINICTUS – Zaubererweiterungen: Name korrigiert und Voraussetzungen angepasst.
- KARNIFILO hieß vorher Kanifilo.
- KLARUM PURUM, Kosten: 8 AsP.
- KRABBELNDER SCHRECKEN – *Starker Ekel*: Typo korrigiert.
- MANUS MIRACULA – Zaubererweiterungen: Name korrigiert und Voraussetzungen angepasst.
- PHYSIOSTABILIS: Effekttext ist wieder korrekt.
- SCHWARZER SCHRECKEN, Kosten: 8 AsP → 4 AsP.
- UNBERÜHRT VON SATINAV: Merkmal Objekt → Merkmal Temporal.
- WIRBELFORM verhält sich jetzt vollständig wie der Eintrag aus **Aventurische Magie II**.
- XENOGRAPHUS – *Besseres Sprachverständnis* hieß vorher *Längere Wirkungsdauer*.
- ZAUBERKLINGE GEISTERSPEER – Zaubererweiterungen: Formatierung korrigiert.
- *Melodie des Magieschadens* war nicht durch Ceoladir wählbar.
- *Melodie der Zähigkeit*: Formatierung korrigiert.
- *Melodie des Zögerns* war nicht durch Derwisch wählbar, konnte aber durch Sangara gewählt werden.
- Herrschaftsrituale sind nun enthalten.
- Falsche Probeneigenschaften von Liturgien:
  - *Kleiner Bannstrahl*: MU/KL/CH → MU/IN/CH
  - *Ehrenhaftigkeit*: MU/KL/CH → MU/IN/CH
  - *Ermutigung*: MU/KL/CH → MU/IN/CH
  - *Friedvolle Aura*: MU/KL/CH → MU/IN/CH
  - *Wasserlauf*: MU/KL/IN → MU/IN/GE
- Text, dass ein bestimmter Aspekt einer Liturgie nicht modifiziert werden kann, fehlt:
  - *Bann der göttlichen Gaben*: Liturgiedauer
  - *Dämonenwall*: Kosten
  - *Liturgieschild*: Kosten
  - *Mächtiger Angriff*: Kosten
  - *Magiebann*: Liturgiedauer
  - *Magiespiegel*: Kosten
  - *Motivation*: Kosten
  - *Namenlose Kälte*: Kosten
- *Ächtung (Exkommunikation)* – Liturgieerweiterungen: Buchname bei der Seitenangabe ergänzt.
- *Blitzschlag*: Verbreitung *Boron (Tod)* statt *Rondra (Sturm)*.
- *Delphingestalt*: Effekttext korrigiert.
- *Häutung* und *Häutung* – Liturgieerweiterungen: Leerzeichen fehlte.
- *Guter Fang*: Liturgie → Zeremonie.
- *Guter Fang* – Liturgieerweiterungen: Formatierung korrigiert.
- *Klarer Geist*: Aspekt *Bildung* entfernt.
- *Namenlose Zweifel*: Effekttext korrigiert.
- *Namenloses Vergessen*: Effekttext korrigiert.
- *Nebelschwaden*: Effekttext korrigiert.
- *Obsession* fehlte.
- *Opfergang*: Typo korrigiert.
- *Pech und Schwefel*: Effekttext vervollständigt.
- *Ruf der Heimat*: Effekttext vervollständigt.
- *Seevogelsprache* – Mehr Vögel: Leerzeichen eingefügt.
- *Sicherer Weg*: Leerzeichen eingefügt.
- *Traumbild*, Effekt: Leerzeichen fehlte.
- *Traumbild* – Liturgieerweiterungen: Formatierung korrigiert.
- *Verblassende Erinnerung*: Falsche Verbreitung.
- *Verblassende Erinnerung* – Liturgieerweiterungen: Formatierung korrigiert.
- *Wasserlauf*: Verbreitung *Allgemein* hinzugefügt, Effekttext korrigiert.
- *Windruf*, Zielkategorie: Objekt (profane Objekte, Segel).
- *Zähe Haut*: Aspekt *Gutes Gold* hinzugefügt.
- *Albernische Bauernwehr*: Wort fehlte.
- *Albernisches Entermesser*: Typo behoben.
- *Amazonensäbel* fehlte.
- *Andergaster*: Formatierung des Waffenvorteils korrigiert.
- *Dietrichset* hat jetzt auch Preis und Gewicht.
- *Faustschild*: Formatierung korrigiert.
- *Gänsebeutel*: Preis korrigiert.
- *Gaoraith*: Länge fehlte.
- *Hakendolch*: Vorteil und Nachteil ergänzt.
- *Handspiegel* zeigt jetzt die dazugehörige Regeltechnik.
- *Harbener Säbel*, Länge: 100 HF → 75 HF.
- *Havener Messer*: Formatierung korrigiert.
- *Hunde-, Pony, Pferdefutter*: Gewicht entfernt.
- *Kettenhemd*: Formatierung angepasst.
- *Kletterseil* hat jetzt korrekte Kosten.
- *Korspieß*: Formatierung korrigiert.
- Der Waffennachteil des *Langbogens* war unvollständig.
- *Neckerdreizack*: Typo behoben.
- *Pergament, gutes, 1 Blatt*: Preis korrigiert.
- *Richtschwert* war nicht als Waffe gruppiert.
- *Seesäbel*: Formatierung korrigiert und fehlendes Wort ergänzt.
- *Sense* war keine improvisierte Waffe mit einem Gewicht von 3,5 Stn.
- Kosten und Gewicht für *Seidenseil* ergänzt.
- *Spealleagh* war nicht als Waffe eingetragen.
- *Streitkolben der Streitenden Königreiche* fehlte.
- *Stockdegen*: Formatierung angepasst.
- *Sturmsense*: Formatierung angepasst.
- *Turnierrüstung*: Formatierung angepasst.
- *Turnierzweihänder*: Leiteigenschaften angepasst.
- *Wurfnetz*: Formatierung korrigiert.
- *Zugvogelfedern*: Preis korrigiert.

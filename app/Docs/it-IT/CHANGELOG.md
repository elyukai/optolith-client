## 1.5.0

### Features

* Esportazione per MapTool ([87cec15](https://github.com/elyukai/optolith-client/commit/87cec15ba9751c329ee39719dc654895b9f4f193))
* Traduzione portoghese ([d8c9f52](https://github.com/elyukai/optolith-client/commit/d8c9f52542120f9e5fa569728b3f11cb79102365), [#676](https://github.com/elyukai/optolith-client/issues/676))
* Supporto nativo per Apple M1 ([94e751f](https://github.com/elyukai/optolith-client/commit/94e751fda169c4de90cdb82346d3d864cf697300))

### Migliorie

* Sicurezza ([723e910](https://github.com/elyukai/optolith-client/commit/723e9106ebb178db6a7cccec2a022b3edaed5b98) e altre)

### Correzioni

* PV aggiuntivi influenzano il valore minimo di COS e non FOR ([390dcb6](https://github.com/elyukai/optolith-client/commit/390dcb616aaa68e5b103bb49dd75d1529c4e7e3a), [#787](https://github.com/elyukai/optolith-client/issues/787))
* Aggiunti gli indicatori per armi a due mani (2M) e improvvisate (i) sul Foglio d’identità ([3f9fae3](https://github.com/elyukai/optolith-client/commit/3f9fae30a2291b8e53486a74dae8cc1533741b94), [#797](https://github.com/elyukai/optolith-client/issues/797))
* Armi usate con Armi nude non avevano il valore di Parata indicato sul Foglio d’identità ([a02700e](https://github.com/elyukai/optolith-client/commit/a02700eeccbd95a75f778d4d9e78ad7a2447dad8), [#1229](https://github.com/elyukai/optolith-client/issues/1229))
* Un valore che dipende da una singola attivazione di un altro valore impedisce di rimuovere tutte le attivazioni di quel valore, se ce ne sono più attive ([092343f](https://github.com/elyukai/optolith-client/commit/092343f45da566a45b13b275899a458fed720a76), [#1097](https://github.com/elyukai/optolith-client/issues/1097))
* Valori che hanno effetto sulle magie estranee potevano essere rimossi se venivano acquistati miglioramenti di incantesimo ([28f260a](https://github.com/elyukai/optolith-client/commit/28f260a2c4a96adb0d36585a478676f95c304414), [#827](https://github.com/elyukai/optolith-client/issues/827))
* Terminazione anomala dovuto alle informazioni sull’equipaggiamento ([ae2fbad](https://github.com/elyukai/optolith-client/commit/ae2fbad1c738354dd468c1b36b06eda729a879e5))
* Le professioni che garantiscono un Valore di Tecnica di Combattimento più elevato del massimo concesso dal Livello d’Esperienza non venivano filtrate ([c8094f5](https://github.com/elyukai/optolith-client/commit/c8094f5ef15f62f69088386b9fc6c64f7d8bfd02), [#1244](https://github.com/elyukai/optolith-client/issues/1244))
* I modificatori di Ini e Mov delle armature venivano gestiti come penalità ([eb5a068](https://github.com/elyukai/optolith-client/commit/eb5a06884db1894e1a9f2b4b040b114cb4dc85cb), [#1091](https://github.com/elyukai/optolith-client/issues/1091))
* Specializzazioni di linguaggio non costavano sempre 1 PAvv e non potevano essere scelte più volte per una singola lingua ([0a59d9e](https://github.com/elyukai/optolith-client/commit/0a59d9e5e571e87525b18d0b25035e73f7cd87bf), [#1082](https://github.com/elyukai/optolith-client/issues/1082))
* Immagini con trasparenza venivano mostrate con sfondo nero ([cc5ecd6](https://github.com/elyukai/optolith-client/commit/cc5ecd6f098ae6c080eeb3b306887727a99c1220), [#800](https://github.com/elyukai/optolith-client/issues/800))
* Il pacchetto culturale bornese modificava Cucinare invece di Lavorazione del cuoio ([397abe2](https://github.com/elyukai/optolith-client/commit/397abe2b4a69582dc49422add1700807272c32d6), [#824](https://github.com/elyukai/optolith-client/issues/824))
* Alcuni errori di battitura in oggetti, lingue e scritture ([397abe2](https://github.com/elyukai/optolith-client/commit/397abe2b4a69582dc49422add1700807272c32d6), [#832](https://github.com/elyukai/optolith-client/issues/832))
* Corretto il titolo di Volontà del ferro ([397abe2](https://github.com/elyukai/optolith-client/commit/397abe2b4a69582dc49422add1700807272c32d6), [#850](https://github.com/elyukai/optolith-client/issues/850))
* Incantesimi e liturgie venivano indicate con punteggiatura e maiuscole diverse ([397abe2](https://github.com/elyukai/optolith-client/commit/397abe2b4a69582dc49422add1700807272c32d6), [#851](https://github.com/elyukai/optolith-client/issues/851))
* Le modifiche di attributo primario per gli oggetti venivano mostrate soltanto nella finestra di modifica, non sul Foglio d’identità ([6c63ab1](https://github.com/elyukai/optolith-client/commit/6c63ab1b5051882ace71f15740c3a69fff4a267f), [#798](https://github.com/elyukai/optolith-client/issues/798))
* Le professioni con valori di attributi impossibili (a causa del Livello d’Esperienza) non possono più essere selezionate ([fdde329](https://github.com/elyukai/optolith-client/commit/fdde329de591319df3f6da11404dd7523d800c3e), [#1109](https://github.com/elyukai/optolith-client/issues/1109))
* Magie di evocazione fornite dalla professione non registravano i prerequisiti corretti ([c1b2e26](https://github.com/elyukai/optolith-client/commit/c1b2e267cb3f02d2d18812415c39c58739ad99ec), [#1240](https://github.com/elyukai/optolith-client/issues/1240))
* Il peso degli elfi non veniva calcolato in maniera corretta ([3b05e69](https://github.com/elyukai/optolith-client/commit/3b05e69e27f7faa1634b50eb134000fe1a2c3a21), [#813](https://github.com/elyukai/optolith-client/issues/813))
* Gli attributi al valore minimo (8) non permettevano di raggiungere un Valore di Tecnica di Combattimento superiore al 6 se facevano da Attributo primario per la Tecnica
 ([47e66d6](https://github.com/elyukai/optolith-client/commit/47e66d65467999e2661eaac30a97b5a1ebfece94), [#835](https://github.com/elyukai/optolith-client/issues/835))
* PDF troppo grande quando si utilizza lo sfondo ([9cb2658](https://github.com/elyukai/optolith-client/commit/9cb26586f3a5026d06f41801d4bbf714631d06a4), [#1094](https://github.com/elyukai/optolith-client/issues/1094))
* Sistema di aggiornamento non funziona con AppImage ([a24ff80](https://github.com/elyukai/optolith-client/commit/a24ff8082a5556fc07af05f113bacfd9c84428a4), [#753](https://github.com/elyukai/optolith-client/issues/753))
* Alcuni requisiti sugli Attributi primari non venivano rispettati ([ac0cdc3](https://github.com/elyukai/optolith-client/commit/ac0cdc377800a1eb380993dbb7914fa88b8f254e), [#1260](https://github.com/elyukai/optolith-client/issues/1260))
* Gli indicatori di Raggio influenzavano altri campi ([0ab65e8](https://github.com/elyukai/optolith-client/commit/0ab65e869c26536127b386753db110f2e26b33af), [#1251](https://github.com/elyukai/optolith-client/issues/1251))
* Si richiedeva soltanto una lingua compatibile invece di tutte ([4dabbdb](https://github.com/elyukai/optolith-client/commit/4dabbdbcd23c1ffeff18a8b1f9497a4a8315aa6a), [#1343](https://github.com/elyukai/optolith-client/issues/1343))
* Le scritture non richiedevano la conoscenza di una lingua compatibile ([1ed0c64](https://github.com/elyukai/optolith-client/commit/1ed0c64b0dd9873593169bd9994082d49299fa3e), [#1344](https://github.com/elyukai/optolith-client/issues/1344))
* Alcune proprietà degli oggetti non venivano salvati ([f2e6138](https://github.com/elyukai/optolith-client/commit/f2e61386abe444aa76f0211469d50c30fde99a0c), [#1252](https://github.com/elyukai/optolith-client/issues/1252))
* La selezione dei propri incantesimi estranei era opzionale ([3574d1b](https://github.com/elyukai/optolith-client/commit/3574d1ba46725d04a83286cd1055c080fe1de95f), [#1315](https://github.com/elyukai/optolith-client/issues/1315))
* Le Tecniche di Combattimento non influenzavano il minimo richiesto sugli Attributi primari ([1ce2db9](https://github.com/elyukai/optolith-client/commit/1ce2db9cfbb06b1ca8a549957b8225af71de9185), [#836](https://github.com/elyukai/optolith-client/issues/836))
* Salvando un eroe veniva cancellata la cronologia per più eroi ([923b760](https://github.com/elyukai/optolith-client/commit/923b7605fee4c4288dc743e962728308f7254ca9), [#811](https://github.com/elyukai/optolith-client/issues/811))
* Allargate le righe della seconda colonna di abilità nel Foglio d’identità ([41ee35b](https://github.com/elyukai/optolith-client/commit/41ee35ba76af42ad837daa6c45a940406b0c5daa), [#1342](https://github.com/elyukai/optolith-client/issues/1342))

### Ringraziamenti

Come ultimo punto, ma non per importanza, un grandissimo **grazie** a tutti coloro che forniscono commenti, suggerimenti e aiuto sui vari canali sociali e un grazie alle seguenti persone su GitHub che hanno contribuito a questa versione!

- [Elidia (@FloraMayr)](https://github.com/FloraMayr)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lector (@Lector)](https://github.com/Lector)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [Marc Schwering (@m4rcsch)](https://github.com/m4rcsch)
- [Pepelios (@Pepelios)](https://github.com/Pepelios)

## 1.4.2

### Migliorie

- Ridotto il tempo di avvio. [#751](https://github.com/elyukai/optolith-client/issues/751)

### Correzioni

- Le formule della caratteristiche derivate occupano troppo spazio sul foglio d’identità. [#729](https://github.com/elyukai/optolith-client/issues/729)
- Rimozione dei requisiti doppi in alcune abilità speciali. [#730](https://github.com/elyukai/optolith-client/issues/730)
- Correzioni minori della localizzazione italiana. [#731](https://github.com/elyukai/optolith-client/issues/731)
- Alcune tecniche di combattimento possono essere impostate a valori più elevati di quanto ammesso dal regolamento. [#749](https://github.com/elyukai/optolith-client/issues/749)
- Il margine superiore delle finestre in sovrimpressione, come nell’inserimento dei vantaggi, è troppo stretto. [#727](https://github.com/elyukai/optolith-client/issues/727)
- Il bonus di impatto non viene calcolato per alcune armi. [#737](https://github.com/elyukai/optolith-client/issues/737)
- La professione *Mago bianco (Accademia Garetiana di Spada e Bastone)* dal **Regolamento** ha un valore di PAvv sbagliato e *Astronomia&nbsp;4* invece di *Alchimia&nbsp;4*. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Campo di testo delle abilità degli animali nel foglio d’identità è troppo piccolo per contenere tutte le abilità. [#733](https://github.com/elyukai/optolith-client/issues/733)
- L’abilità speciale *Bladestorm* si applica alle tecniche di combattimento sbagliate. [#768](https://github.com/elyukai/optolith-client/issues/768)
- Immagini con estensione in maiuscoletto non vengono accettate come ritratto. [#762](https://github.com/elyukai/optolith-client/issues/762)
- Viene mostrata l’icona di caricamento invece del ritratto su fogli d’identità di personaggi senza ritratto. [#759](https://github.com/elyukai/optolith-client/issues/759)
- Su Mac, con lo sfondo pergamenato attivato, vengono generate pagine bianche di troppo nel PDF finale. [#748](https://github.com/elyukai/optolith-client/issues/748)

### Ringraziamenti

Come ultimo punto, ma non per importanza, un grandissimo **grazie** a tutti coloro che forniscono commenti, suggerimenti e aiuto sui vari canali sociali e un grazie alle seguenti persone su GitHub che hanno contribuito a questa versione!

- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.4.1

### Correzioni

- La localizzazione italiana non era disponibile.

## 1.4.0

Primo rilascio della versione italiana.

### API

Ci sono importanti modifiche in questa nuova versione, che cambiano anche il modo in cui sono memorizzati i dati. Se fai uso dei file memorizzati da Optolith, è possibile fare un salto su [Discord](https://discord.gg/wfdgB9g) in modo da avere più informazioni sulle modifiche nel dettaglio.
Siccome sempre più persone fanno uso dei dati di Optolith, da questa versione in poi seguiremo le regole del *versionamento semantico*, in modo da permettere agli utenti di fare affidamento alla compatibilità dei file sorgente e dei file dei dati, verificandone soltanto il numero di versione.
Ci sarà un nuovo formato di dati sia per gli eroi memorizzati che per i dati sorgente.
Le modifiche non sono ancora finalizzate e la nuova versione maggiore è ancora lontana, ma è consigliato aggiornarsi al nuovo formato di dati il prima possibile.

### Ringraziamenti

Come ultimo punto, ma non per importanza, un grandissimo **grazie** alle seguenti persone su GitHub che hanno contribuito a questa versione!

- [Jonas (@Rahjenaos)](https://github.com/Rahjenaos)
- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [manuelstengelberger (@manuelstengelberger)](https://github.com/manuelstengelberger)
- [Philipp A. (@flying-sheep)](https://github.com/flying-sheep)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

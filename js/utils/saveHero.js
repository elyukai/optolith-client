import APStore from '../stores/APStore';
import CultureStore from '../stores/rcp/CultureStore';
import ELStore from '../stores/ListStore';
import ListStore from '../stores/ListStore';
import ProfessionStore from '../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../stores/rcp/ProfessionVariantStore';
import RaceStore from '../stores/rcp/RaceStore';

export default () => {
	var obj = {
		ap: APStore.getForSave()
	};

	var json = JSON.stringify(obj);
    var blob = new Blob([json], {type: "application/json"});
    var url  = window.URL.createObjectURL(blob);
    window.open(url);
	// window.open('data:application/json;' + json);
	// var w = window.open();
	// w.document.open();
	// w.document.write('<html><body><pre>' + json + '</pre></body></html>');
    // w.document.close();

	return true;
};
// NSWA Ranga online script.
// copyright (R) 2019 NSWA Maintainers

var online = {};
online.msgUUID = 'a423b61d-d302-4a85-ad45-2c284f82d3d8';

// This is the failback 'online.SWDLPrefix', if webconsole supported, 'online.SWDLPrefix' will be overrided to a mirror address.
online.SWDLPrefix = 'https://nswa-project.github.io/swdl/';
online.devname = null;

online.debugLog = str => {
	console.log('[nswa online] ' + str);
}

online.promiseDebug = proto => {
	online.debugLog('promise error, printing debug info...');
	utils.promiseDebug(proto);
}

// very old webconsole has a wrong 'utils.ajaxGet' impl, so use 'online.ajaxGet'
online.ajaxGet = (uri, blob) => {
	const promise = new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();

		if (blob)
			xhr.responseType = 'arraybuffer';

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(blob ? xhr.response : xhr.responseText);
				} else {
					reject(xhr.status);
				}
			}
		}

		xhr.open("GET", uri, true);
		xhr.send();
	});

	return promise;
}

online.installOTAUpdate = uri => {
	let d = null;
	webcon.loadScript('swdeploy', 'scripts/swdeploy.js?vts=' + new Date().getTime()).then(e => {
		d = dialog.show(null, null, "正在下载更新...", []);
		return online.ajaxGet(uri, true);
	}).catch(() => {
		online.debugLog('load script failed');
	}).then(blob => {
		dialog.close(d);
		swdeploy.start(blob);
	}).catch(status => {
		dialog.close(d);
		dialog.simple('OTA package download failed, status: ' + status);
	});
}

online.doFullpackUpdate = () => {
	webcon.lockScreen();
	online.ajaxGet(online.SWDLPrefix + 'fullpack-devmap.txt', false).then(d => {
		let data = ranga.parseProto(d);
		let re = new RegExp('%' + online.devname + ': ([^\n]*)');
		dialog.show('icon-update', '完整包更新', '系统将会被升级到 ' + data.version + ' 版本。<br><br>点击“更新”按钮后，将会开始下载适合你的设备的更新并安装，安装后，系统将在几分钟内开始重启，<b>请不要进行任何操作，尤其不要手动重启或者断开电源！系统可能会进行数次重启，请务必耐心等待。</b>当更新完毕后，你的部分或全部配置可能会被重置。', [
			{
				name: '更新',
				func: (d => {
					online.installOTAUpdate(data.uriprefix + data.payload.match(re)[1]);
					dialog.close(d);
				})
			}, {
				name: '取消',
				func: dialog.close
			}
		]);
	}).catch(err => {
		dialog.simple('检索 fullpack-devmap 失败，请重试。');
	}).finally(() => webcon.unlockScreen());
}

online.sysUpdateNotify = (type, next, uri, comment, changelog) => {
	let body = '';
	let btns = [];
	switch (type) {
	case 0:
		body = '新的完整包更新被释出。你可以通过 NSWA Online 更新到最新的 Stable/Oldstable 版本。如果还有新的版本，则可以通过后续的 OTA 更新取得。点击“安装更新”按钮后，将会开始下载适合你的设备的更新并安装，安装后，系统将在几分钟内开始重启，<b>请不要进行任何操作，尤其不要手动重启或者断开电源！系统可能会进行数次重启，请务必耐心等待。</b>当更新完毕后，你的部分或全部配置可能会被重置。';

		btns.push({
			name: '立即更新',
			func: (notify => {
				let passwd = prompt('输入超级用户密码以安装完整包更新', 'ranga');
				ranga.api.auth(passwd).then(proto => {
					webcon.setToken(proto.payload);
					online.doFullpackUpdate();
					webcon.closeNotify(notify);
				}).catch(defErrorHandler);
			})
		});
		break;
	case 1:
		body = '更新 ' + next + ' 无法直接自动安装，需要您打开一个 URI 并按照其中的指示进行操作。<br><br>此更新的 Changelog（可能不完整）如下。<br>' + changelog.replace(/\|/g, '<br>');
		if (comment !== '')
			body += "<br><br>" + comment;

		btns.push({
			name: '打开 URI',
			func: (notify => {
				window.location.href = uri;
			})
		});
		break;
	case 2:
		body = '更新 ' + next + ' 的 Changelog 如下。<br><br>' + changelog.replace(/\|/g, '<br>');
		if (comment !== '')
			body += "<br><br>" + comment;

		btns.push({
			name: '安装更新',
			func: (notify => {
				let passwd = prompt('输入超级用户密码以安装 OTA 更新', 'ranga');
				ranga.api.auth(passwd).then(proto => {
					webcon.setToken(proto.payload);
					online.installOTAUpdate(online.SWDLPrefix + uri);
					webcon.closeNotify(notify);
				}).catch(defErrorHandler);
			})
		});
		break;
	}
	webcon.sendNotify('nswa-online-sysupdate', 'icon-update', '发现新的 NSWA Ranga 更新：' + next, body, 'warning', true, btns);
}

online.init_ver1 = () => {
	if ('_webcon_online_uri' in window) {
		online.SWDLPrefix = _webcon_online_uri + "/swdl/";
	}

	ranga.api.query('sysinfo', ['-vp']).then(proto => {
		let info = ranga.parseProto(proto.payload + "\n\n");
		console.log(info);
		online.devname = info.model;
		if (info.version !== '') {
			return online.ajaxGet(online.SWDLPrefix + 'ota/' + info.version, false)
		} else {
			online.debugLog('system version invalid');
		}
	}).then(data => {
		let info = ranga.parseProto(data + "\n\n");
		console.log(info);
		if (info.v === '1') {
			switch (info.t) {
			case 'tmp-unavl':
				online.debugLog('Ranga system is up-to-date');
				break;
			case 'open-uri':
				if ('fullpack' in info && info.fullpack === 'true') {
					online.sysUpdateNotify(0, '完整包更新', null, null, null);
				} else {
					online.sysUpdateNotify(1, info.next_version, info.uri, info.comment, info.changelog || "");
				}
				break;
			case 'ota-generic':
				online.sysUpdateNotify(2, info.next_version, info.uri, info.comment, info.changelog);
				break;
			}
		} else {
			online.debugLog('update metadata version invalid,');
		}
	}).catch(online.promiseDebug);
}

online.init_bcast = () => {
	//let d = document.getElementById('nav_logo');
	//d.style.flexFlow = 'column';
	//d.innerHTML = atob('');
	//d.innerHTML += "<div class='tips' style='padding: 2px 12px'><a href='https://glider0.github.io/doodles/'>了解 NSWA Doodles</a></div>";

	//document.body.style.background = ;
	//document.getElementById('main').style.backgroundColor = '#ffffff7d';
	//document.getElementById('nav').style.backgroundColor = '#fafafa00';
}

const nswaOnlineInit = ver => {
	online.debugLog('nswaOnlineInit: ' + ver);
	try {
		switch (ver) {
		case 1:
			online.init_bcast();
			online.init_ver1();
			break;
		default:
			debugLog("Unsupported webconsole version '" + ver + "'");
			break;
		}
	} catch (e) {
		online.debugLog('init failed');
	}
}

import * as _$ from "https://cdn.jsdelivr.net/npm/bijou.js@latest";
console.log((new URLSearchParams(window.location.search)).get("q"))
if ((new URLSearchParams(window.location.search).get("q") || "").startsWith("!")) {
	_$.getHTML(`https://cors.explosionscratc.repl.co/www.google.com/search?q=${escape((new URLSearchParams(window.location.search)).get("q").replace(/^!/, ""))}&btnI=Im+Feeling+Lucky`, () => {}).then(html => {
		window.location.href = html.querySelector("a").href;
	});
} else {
	run();
}
window.addEventListener("keydown", konami(() => document.documentElement.classList.toggle("cool-mode")))
function konami(callback) {
    let kkeys = [];
    // up,up,down,down,left,right,left,right,B,A
    const konami = '38,38,40,40,37,39,37,39,66,65';
    return event => {
        kkeys.push(event.keyCode);
        if (kkeys.toString().indexOf(konami) >= 0) {
            callback();
            kkeys = [];
        }
    };
}
function run() {
	if (new URLSearchParams(window.location.search).get("coolMode")) {
		document.documentElement.classList.add("cool-mode");
		document.head.appendChild(_$.createElement(`<meta name="theme-color" content="rgb(8, 196, 155)">`))
	} else {
		document.head.appendChild(_$.createElement(`<meta name="theme-color" content="#DC143C">`))
	}
	let inp = document.getElementById("input");
	let out = document.getElementById("results");
	let dym_a = document.querySelector("#dym")
	let urlMode = (new URLSearchParams(window.location.search)).get("mode") || "web"
	document.querySelector("[data-value='web']").checked = urlMode === "web" ? true : false;
	document.querySelector("[data-value='images']").checked = urlMode === "images" ? true : false;
	document.querySelector("[data-value='news']").checked = urlMode === "news" ? true : false;
	document.querySelector(".switch-field").onclick = () => {
		updateHistory();
		ftch(`https://apis.explosionscratc.repl.co/google?q=${escape(inp.value)}`)
	}
	var cache = JSON.parse(localStorage.getItem("cache")) || {};
	var wolframCache = JSON.parse(localStorage.getItem("wolfram_cache")) || {};
	var newsCache = JSON.parse(localStorage.getItem("news_cache")) || {};
	inp.value = (new URLSearchParams(window.location.search)).get("q") || localStorage.getItem("input") || "";
	if (inp.value === (new URLSearchParams(window.location.search)).get("q")) {
		ftch(`https://apis.explosionscratc.repl.co/google?q=${escape(inp.value)}`)
	}
	if ((new URLSearchParams(window.location.search)).get("darkMode") == 1) {
		document.documentElement.classList.add("dark-mode");
		updateHistory();
	}

	function updateHistory() {
		if ((new URLSearchParams(window.location.search)).get("incognito")){
			console.log(`Would push to history but using incognito, mode: ${mode()}`);
			return;
		}
		console.log(`Pushing to history: ${mode()}`);
		document.title = inp.value ? `${inp.value} – Search` : "Search engine";
		history.pushState({}, `${inp.value} – Search`, `?q=${escape(inp.value)}&darkMode=${+document.documentElement.classList.contains("dark-mode")}&mode=${mode()}`)
	}
	let phdrs = ["Search something!", "Type anything here to search!", "This is a cool search engine", "Why aren't you typing stuff here?", "Try clicking the info button on search results!", "This took a long time to make", "Do you like the search engine?", "I also made a server to scrape google.", "Unlike google this doesn't track you!", "You can share links to searches!", "I worked hard to style this!"]
	setInterval(() => {
		inp.setAttribute("placeholder", phdrs[Math.floor(Math.random() * phdrs.length)])
	}, 3000);
	let dark_btn = document.querySelector("button#dark-mode")
	dark_btn.onclick = () => {
		document.documentElement.classList.toggle("dark-mode");
		updateHistory();
	}
	var width = 0;
	var clicktime = Date.now();
	setInterval(() => {
		document.querySelector(".top").style.width = `${Math.floor(width)}vw`;
	}, 100)
	window.onpopstate = (e) => {
		inp.value = (new URLSearchParams(window.location.search)).get("q");
		ftch(`https://apis.explosionscratc.repl.co/google?q=${escape(inp.value)}`)
	}
	inp.addEventListener("keyup", (e) => {
		if (key(e) && e.key !== "Enter") return;
		if ((e.key === "Enter" && e.shiftKey)) {
			_$.getHTML(`https://cors.explosionscratc.repl.co/www.google.com/search?q=${escape(inp.value.replace(/^!/, ""))}&btnI=Im+Feeling+Lucky`, () => {}).then(html => {
				window.open(html.querySelector("a").href, "_blank")
			});
			return;
		}
		if (e.key === "Enter") {
			ftch(`https://apis.explosionscratc.repl.co/google?q=${escape(inp.value)}`);
		}
		localStorage.setItem("input", inp.value)
		let html = `<i><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path d="M955 768q-20 34-58 44.5t-72.5-9.5t-45-58.5T789 672q61-106 68-226.5T817.5 216T680 29q47 16 88 40q90 52 152 134.5t87 176t12.5 196T955 768zM768 955q-90 52-192.5 64.5t-196-12.5t-176-87T69 768q-20-34-10-72.5t44.5-58.5t73-9.5T235 672q46 80 116 138t151 86.5t170.5 31T846 899q-37 33-78 56zM512 192q-123 0-230.5 54.5T103 395.5T9 608q-9-49-9-96q0-104 40.5-199t109-163.5T313 40.5T512 0q40 0 68 28t28 68t-28 68t-68 28z" fill="#626262"/></svg> Loading results</i>`
		//if (out.innerHTML !== html) out.innerHTML = html
	})

	function mode() {
		return document.querySelector("[data-value='images']").checked ? "images" : document.querySelector("[data-value='web']").checked ? "web" : "news"
	}
	function ftch(url) {
		(async () => {
			dym_a.innerHTML = "";
			if (!inp.value.trim().length) {
				out.innerHTML = '';
				return
			};
			var mean = "No mean";
			try {
				console.log("Fetching mean");
				mean = await didYouMean(inp.value);
			} catch (e) {
				console.warn("Error:")
				console.info(e.stack)
			}
			console.log(`Mean:`, mean)
			if (mean.mode !== "original") {
				console.log(`New: ${mean.suggestion}, type: ${mean.mode}`);
				dym_a.innerHTML = `${mean.mode === "dym" ? "Did you mean: " : mean.mode === "results_for" ? "Showing results for: " : ""} <a href="${`?q=${escape(mean.suggestion)}&darkMode=${+document.documentElement.classList.contains("dark-mode")}&mode=${mode()}`}">${_$.escapeHTML(mean.suggestion)}</a>`;
			} else {
				console.log('Original mode')
			}
			if (mean.mode === "results_for") {
				console.log("Setting input value")
				inp.value = mean.suggestion;
			}
			updateHistory();
			if (mode() == "images") {
				width = 0;
				if (cache[`https://apis.explosionscratc.repl.co/image-search?q=${escape(inp.value)}`.toLowerCase()]) {
					out.innerHTML = cache[`https://apis.explosionscratc.repl.co/image-search?q=${escape(inp.value)}`.toLowerCase()].map(i => {
						let color = _$.blendColors("#ffa126", "#f5587f", _$.random(0, 100));
						let placeholder = `src="https://via.placeholder.com/${Math.ceil(i.width / 10)}x${Math.ceil(i.height / 10)}/${color.replace("#", "")}/${_$.lightOrDark(color).lightOrDark === "light" ? "000000" : "FFFFFF"}/?text=%20"`;
						return `<img class="lazy" data-gallery="gallery1" onclick="updateImg(this)" id="img" data-src="${i.url}">`;
					}).join("\n");
					lazyLoadInstance.update();
					return;
				}
				let widthInt = setInterval(() => {
					width += (100 - width) / (Math.random() * 3 + 30);
				}, 500)
				fetch(`https://apis.explosionscratc.repl.co/image-search?q=${escape(inp.value)}`).then(res => res.json()).then(json => {
					cache[`https://apis.explosionscratc.repl.co/image-search?q=${escape(inp.value)}`.toLowerCase()] = json;
					out.innerHTML = json.map(i => {
						return `<img class="lazy" data-gallery="gallery1" onclick="updateImg(this)" id="img" data-src="${i.url}">`
					}).join("\n");
					lazyLoadInstance.update();
					width = 100;
				});
				return
			}
			if (mode() === "news") {
				width = 0;
				let widthInt = setInterval(() => {
					width += (100 - width) / (Math.random() * 3 + 30);
				}, 500)
				console.log("News");
				let newsUrl = `https://apis.explosionscratc.repl.co/news-search?q=${escape(inp.value.trim())}`.toLowerCase();
				if (newsCache[newsUrl]) {
					out.innerHTML = newsCache[newsUrl].map((i) => {
						return `<li class="news"><h3><img src="https://www.google.com/s2/favicons?domain=${(new URL(i.web_url).hostname)}" id="icon">${i.abstract || "<i>No title</i>"}</h3><a id="url" href="${_$.escapeHTML(i.web_url)}">${_$.escapeHTML(new URL(i.web_url).hostname)}</a><br><br><span id="text">${_$.escapeHTML(i.lead_paragraph)}</span></li>`
					}).join("\n");
					clearInterval(widthInt)
					width = 100
					return
				}
				fetch(newsUrl).then(res => res.json()).then(json => {
					newsCache[newsUrl] = json.response.docs;
					clearInterval(widthInt)
					width = 100;
					out.innerHTML = json.response.docs.map((i) => {
						return `<li class="news"><h3><img src="https://www.google.com/s2/favicons?domain=${(new URL(i.web_url).hostname)}" id="icon">${i.abstract || "<i>No title</i>"}</h3><a id="url" href="${_$.escapeHTML(i.web_url)}">${_$.escapeHTML(new URL(i.web_url).hostname)}</a><br><br><span id="text">${_$.escapeHTML(i.lead_paragraph)}</span></li>`
					}).join("\n");
					localStorage.setItem('news_cache', JSON.stringify(newsCache))
				})
				width = 100;
				return;
			}
			width = 0;
			let widthInt = setInterval(() => {
				width += (100 - width) / (Math.random() * 3 + 30);
			}, 500)
			out.innerHTML = ""
			let wolframUrl = `https://apis.explosionscratc.repl.co/quick-answer?q=${escape(inp.value.trim().toLowerCase())}`;
			localStorage.setItem("wolfram_cache", JSON.stringify(wolframCache))
			if (!wolframCache[wolframUrl]) {
				console.info(`Fetching from wolfram`)
				fetch(wolframUrl).then(res => res.json()).then(answer => {
					wolframCache[wolframUrl] = answer;
					if (!answer.error && !document.querySelector(".wolfram")) {
						out.innerHTML = `<li class="wolfram"><h4>${answer.text}</h4><br><span><i>Quick answer by Wolfram Alpha</i></span></li>\n${out.innerHTML}`
					}
				})
			} else {
				console.info(`Getting from cache`)
				let answer = wolframCache[wolframUrl]
				if (!answer.error && !document.querySelector(".wolfram")) {
					out.innerHTML = `<li class="wolfram"><h4>${answer.text}</h4><br><span><i>Quick answer by Wolfram Alpha</i></span></li>\n${out.innerHTML}`
				}
			}
			if (inp.value.toLowerCase().startsWith("define ")) {
				if (!cache[`https://apis.explosionscratc.repl.co/dictionary?q=${escape(input.value.replace("define ", "").trim())}`.toLowerCase()]) {
					fetch(`https://apis.explosionscratc.repl.co/dictionary?q=${escape(input.value.replace("define ", "").trim())}`).then(res => res.json()).then(json => {
						out.innerHTML += `<li class="definition"><h3>${_$.escapeHTML(json.word)}</h3><br><span id="def">${_$.escapeHTML(json.pronounciation)} • ${_$.escapeHTML(json.type.toLowerCase().replace(/^./, (i) => i.toUpperCase()))}</span><br><br><span id="text">${_$.escapeHTML(json.meaning)}</span><br><audio src="${json.audio[0].url}" controls><i>Your browser does not support audio!</i></audio>`
					})
				} else {
					let json = cache[`https://apis.explosionscratc.repl.co/dictionary?q=${escape(input.value.replace("define ", "").trim())}`.toLowerCase()]
					out.innerHTML += `<li class="definition"><h3>${_$.escapeHTML(json.word)}</h3><br><span id="def">${_$.escapeHTML(json.pronounciation)} • ${_$.escapeHTML(json.type.toLowerCase().replace(/^./, (i) => i.toUpperCase()))}</span><br><br><span id="text">${_$.escapeHTML(json.meaning)}</span><br><audio src="${json.audio[0].url}" controls><i>Your browser does not support audio!</i></audio>`
				}
			}
			if (!cache[url.toLowerCase()]) {
				try {
					if (!navigator.onLine) {
						clearInterval(widthInt);
						width = 0;
						if (!document.querySelector("#popup")) {
							alert("No internet! 😩");
						}
						out.innerHTML = "";
						return
					}
					fetch(url).then(res => res.json()).then(json => {
						cache[url.toLowerCase()] = json;
						try {
							console.log(math.evaluate(inp.value))
							out.innerHTML += `<li class="math_eval"><h3>${math.evaluate(inp.value)}</h3></li>`;
						} catch (e) {}
						update();
					});
				} catch (e) {
					clearInterval(widthInt);
					width = 0;
					console.error(e.stack);
					if (navigator.onLine) {
						alert("Error! Check console for details!");
					}
					out.innerHTML = "";
				}
			} else {
				try {
					console.log(math.evaluate(inp.value))
					out.innerHTML += `<li class="math_eval"><h3>${math.evaluate(inp.value)}</h3></li>`;
				} catch (e) {}
				update();
			}

			function update() {
				clearInterval(widthInt);
				width = 100;
				let info_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="#626262"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8z"/><circle cx="12" cy="8" r="1"/><path d="M12 10a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1z"/></g></svg>`;
				let history_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-6.88 2.77V3a1 1 0 0 0-2 0v4.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 0-2h-2.4A8 8 0 1 1 4 12a1 1 0 0 0-2 0A10 10 0 1 0 12 2zm0 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2h-1V9a1 1 0 0 0-1-1z" fill="#626262"/></svg>`;
				out.innerHTML += cache[url.toLowerCase()].map(i => ({
					title: i.title || "No title",
					link: i.link || "",
					snippet: i.snippet || "No snippet available"
				})).map(i => {
					let yt_re = /^.*(?:youtu.be\/|youtube(?:-nocookie)?.com\/(?:v\/|.*u\/\w\/|embed\/|.*v=))([\w-]{11}).*/i
					let img_re = /(?:https?:)?\/\/?[^\'"<>]+?\.(?:jpg|jpeg|gif|png)/i
					let special_stuff = "";
					if (yt_re.test(i.link)) {
						special_stuff = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${i.link.match(yt_re)[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
					}
					return `<li><h3><img src="https://www.google.com/s2/favicons?domain=${(new URL(i.link).hostname)}" id="icon">${_$.escapeHTML(i.title)}<span id="info_icon">${info_icon}</span><span id="archive_icon">${history_icon}</span></h3><a id="url" target="_blank" href=${_$.escapeHTML(i.link)}>${_$.escapeHTML((new URL(i.link)).hostname)}</a><br><br><span id="text">${_$.escapeHTML(i.snippet.replace(/(\W)\1+/g, "$1")).linkify()}</span>${special_stuff}</li>`
				}).join("\n");
				_$.each(document.querySelectorAll("ul#results > li"), (li) => {
					let non_listen = ["definition", "math_eval", "wolfram"]
					if (!(non_listen.includes(li.classList[0]))) {
						li.onmousedown = () => {
							clicktime = Date.now();
						}
						li.onmouseup = () => {
							if (Date.now() - clicktime < 200) {
								window.open(li.querySelector("a#url").href, "_blank")
							}
						}
						li.querySelector("#text").onmouseup = (e) => {
							e.stopPropagation();
						}
						li.querySelector("a").onmouseup = (e) => {
							e.stopPropagation();
						}
						tippy(li.querySelector("a"), {
							content: li.querySelector("a").href,
							theme: document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
						})
						li.querySelector("#archive_icon").onmouseup = (e) => {
							e.stopPropagation();
							window.open(`http://web.archive.org/web/${li.querySelector("a").href}`, "_blank")
						}
						tippy(li.querySelector("#archive_icon"), {
							content: "View archived version",
							theme: document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
						})
						li.querySelector("#info_icon").onmouseup = (e) => {
							e.stopPropagation();
							fetch(`https://apis.explosionscratc.repl.co/link-preview?q=${escape(li.querySelector("a").href)}`).then(res => res.json()).then(json => {
								alert({
									title: `<img src="https://www.google.com/s2/favicons?domain=${(new URL(li.querySelector("a").href).hostname)}" id="icon">` + _$.escapeHTML(json.title) || "No info",
									text: (json.images.length > 0 ? `<img src="${json.images[0]}" id="info_image">` : "") + _$.escapeHTML(json.description || li.querySelector("#text").innerText)
								})
							})
						}
						tippy(li.querySelector("#info_icon"), {
							content: "Info",
							theme: document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
						})
					}
				})
				localStorage.setItem("cache", JSON.stringify(cache))
			}
		})();
	}
	window.onkeyup = (e) => {
		if (document.activeElement !== inp) {
			inp.focus();
			inp.value += e.key.length > 1 ? "" : e.key;
		}
	}

	function key(e) {
		return (e.key.length !== 1 || e.ctrlKey || e.altKey) && e.key !== "Enter" && e.key !== "Backspace"
	}
	inp.onkeyup = _$.debounce((e) => {
		if (key(e)) return;
		ftch(`https://apis.explosionscratc.repl.co/google?q=${escape(inp.value)}`);
	}, 1000)
	document.querySelector("button").onclick = _$.debounce(() => {
		ftch(`https://apis.explosionscratc.repl.co/google?q=${escape(inp.value)}`);
	}, 500)
	if (!String.linkify) {
		String.prototype.linkify = function() {
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
			return this.replace(urlPattern, '<a href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>').replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
		};
	}
	async function didYouMean(text) {
		let dym_html = await _$.getHTML(`https://cors.explosionscratc.repl.co/google.com/search?q=${escape(text)}`, () => {});
		let el = dym("Did you mean:") || dym("Showing results for");
		let dym_mode = dym("Did you mean:") ? "dym" : dym("Showing results for") ? "results_for" : "original"
		if (!el) {
			return {
				mode: "original",
				suggestion: text
			}
		};
		return {
			suggestion: el.parentElement.querySelector("a").innerText,
			mode: dym_mode
		}

		function dym(t) {
			let els = dym_html.querySelectorAll("*");
			for (let i = 0; i < els.length; i++) {
				if (els[i].innerText === (t)) return els[i]
			}
		}
	}
}
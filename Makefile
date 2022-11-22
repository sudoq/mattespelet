serve:
	python3 -m http.server
tidy:
	tidy -i -m -w 160 -ashtml -utf8 *.html
release:
	/bin/bash scripts/make_release.sh

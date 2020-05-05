HTML_MINIFIER_OPTS := --minify-js --minify-css --collapse-whitespace --collapse-inline-tag-whitespace --collapse-boolean-attributes --remove-attribute-quotes --remove-comments --remove-empty-attributes --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --remove-tag-whitespace

PREFIX := ../man

ALL := $(patsubst %.md, $(PREFIX)/%.html, $(wildcard *.md))

all : $(ALL)

$(PREFIX)/%.html : %.md
	pandoc -s --toc --toc-depth=3 -f markdown -t html --template template.html $< | html-minifier $(HTML_MINIFIER_OPTS) > $@

clean:
	rm -f $(ALL)

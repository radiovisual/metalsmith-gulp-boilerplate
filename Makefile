node_modules: package.json
	npm install

setup: node_modules

	@echo  && echo making src directory
	@mkdir -p src/{content,images,scripts,styles}

	@echo making partials directory && echo
	@mkdir -p partials

	@echo making layouts directory && echo
    @mkdir -p layouts

.PHONY: setup
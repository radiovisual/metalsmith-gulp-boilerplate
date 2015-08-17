node_modules: package.json
	@npm install

setup: node_modules

	@echo  && echo making src directory
	@mkdir -p src/{content,images,scripts,styles}

	@echo making template directory && echo
	@mkdir -p templates/partials

.PHONY: setup
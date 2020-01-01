SUBDIRS = static_1 static_2 shared_1 shared_1_with_static_1 shared_2 shared_2_with_static_1
     
.PHONY: subdirs $(SUBDIRS)

subdirs: $(SUBDIRS)

$(SUBDIRS):
	$(MAKE) -C $@
STATIC = static_1 static_2
SHARED = shared_1 shared_2
SHARED_WITH = shared_1_with_lib shared_2_with_lib
STATIC_WITH = static_1_with_lib static_2_with_lib

SUBDIRS = $(STATIC) $(SHARED) $(SHARED_WITH) $(STATIC_WITH)
     
.PHONY: subdirs $(SUBDIRS) clean

subdirs: $(SUBDIRS)

$(SUBDIRS):
	$(MAKE) -C $@

clean:
	$(MAKE) -C $(SUBDIRS) clean
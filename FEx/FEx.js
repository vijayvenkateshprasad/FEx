/***********

Provide your feedback @ vijayvenkateshprasadn@gmail.com

************/

(function ($) {
    if ($ && $.ui)
        $.widget('custom.FEx', {

            options: {
                filesSrc: "",
                postData: "",
                rootPath: "",
                ajaxType: "",
                rootName: "Root",
                files: null,
                formatedData: new Array(),
                data: "",
                mapMaximumCharacter: 50,
                dirFieldMaxWidth: 350,
                dirFieldMinWidth: 50,
                customScroll: false,
                resize: true,
                dateFormat: 'd M, yy',
                updateAction: {
                    renameUrl: '',
                    deleteUrl: '',
                    createFolderUrl: '',
                    addFile: '',
                    moveUrl:''
                },
                gridRows: {},
                setDynamicHeight: true,
                gridTemplate:{},
                directorySort: {},
                _order: {},
                history: null
            },

            //Creates the Elements -- jquery default method
            _create: function () {
                var elt = this.element;
                var self = this;
                var x = elt.width(), y = elt.height();
                var directoryMenu = "<li id='dirNewFolder'>New Folder</li><li id='dirRename'>Rename</li><li id='dirDelete'>Delete</li><li id='dirAddFiles'>Add File </li> <input style='display:none' type='file' id='fileBtn' multiple='multiple' />";


                var sortableItems = "";                
                var items = this.options.directorySort;
                if (items) {
                    Object.keys(items).forEach(function (key,name) {
                        console.log(key);
                        sortableItems = sortableItems + "<li id='" + key + "'>" + items[key].title + "</li>";
                    });                    
                }


                var fexToolBar = "<div id='" + wdgtConsts.fExToolOptions + "' class='" + wdgtConsts.fExToolOptions.replace(/_/g, "") + "'><div id='" + wdgtConsts.fExDirectoryToolsCntnr + "' class='" + wdgtConsts.fExDirectoryToolsCntnr.replace(/_/g, "") + "'><ul id='" + wdgtConsts.fExDirectorySortCntnr + "' class='" + wdgtConsts.fExDirectorySortCntnr.replace(/_/g, "") + "'> <a>Sort By</a> " +sortableItems+"</ul>" +
                    "  </div><div class='fExDirectoryContainer'><ul id='" + wdgtConsts.fExDirectoryOptions + "' class='" + wdgtConsts.fExDirectoryOptions.replace(/_/g, "") + "'><img class='fExDirectoryMenuImg'  src='/Scripts/FEx/Images/Menu.png'> </img> " + directoryMenu + " </ul> </div> </div>";

                var containersHtml = "<div id='" + wdgtConsts.fExContainer + "' class='" + wdgtConsts.fExContainer.replace(/_/g, "") + "'>" +
                    "<div id='" + wdgtConsts.fExToolBar + "' class='" + wdgtConsts.fExToolBar.replace(/_/g, "") + "'>" + fexToolBar + "</div> " +
                    " <div id='" + wdgtConsts.fExDirectoryField + "' class='" + wdgtConsts.fExDirectoryField.replace(/_/g, "") + "'>" +
                    "</div>  <div id='" + wdgtConsts.fExFolderField + "' class='" + wdgtConsts.fExFolderField.replace(/_/g, "") + "'>" +
                    "</div>  <div id='" + wdgtConsts.fExDocumentField + "' class='" + wdgtConsts.fExDocumentField.replace(/_/g, "") + "'>" +
                    "<div id='" + wdgtConsts.fExDocumentFieldTitle + "' class='" + wdgtConsts.fExDocumentFieldTitle.replace(/_/g, "") + "'></div><div id='" + wdgtConsts.fExDocumentFieldContent + "' class='" + wdgtConsts.fExDocumentFieldContent.replace(/_/g, "") + "' ></div>" +
                    "</div></div>";

                var alertBox = "<div id='alert'></div>";
                var confirmBox = "<div id='confirm'><div class='body'></div><div class='footer'><span class='btnPrimary'>Yes</span><span class='btnSecondary'>No</span></div></div>";

                this.options.widgetObj = elt.append(containersHtml + alertBox + confirmBox);

                var folderMapDiv = "<div id='" + wdgtConsts.folderMap + "' class='" + wdgtConsts.folderMap.replace(/_/g, "") + "'><hr></div>";

                var headerTr = "";
                // "<tr><th class='thCheckBox'><div>" + wdgtConsts.gridHeaders.selectAllchkBox + "</div></th><th><div>" + wdgtConsts.gridHeaders.fileType + "</div></th><th><div>" + wdgtConsts.gridHeaders.fileName + "</div></th><th><div>" + wdgtConsts.gridHeaders.lastModified + "</div></th></tr>"

                var headerThs = "<th class='thCheckBox'><div>" + wdgtConsts.gridHeaders.selectAllchkBox + "</div></th>";
                var columns = this.options.gridTemplate;

                Object.keys(columns).forEach(function(key){
                    headerThs = headerThs + "<th id='" + key + "'><div>" + columns[key].title + "</div></th>";
                    self.options._order[key] = columns[key].title;
                });

                headerTr = "<tr>" + headerThs + "</tr>";


                var gridHeader = "<table id='" + wdgtConsts.folderGrid + "' class='" + wdgtConsts.folderGrid.replace(/_/g, "") + "'><thead>"+headerTr+"</thead><tbody></tbody></table></div>";
                var folderGridDiv = "<div id='" + wdgtConsts.folderGridContainer + "' class='" + wdgtConsts.folderGridContainer.replace(/_/g, "") + "'>" + gridHeader + "</div>"
                var folderFileCountDiv = "<div id='" + wdgtConsts.folderFileCount + "' class='" + wdgtConsts.folderFileCount.replace(/_/g, "") + "'><hr></div>"
                $('#' + wdgtConsts.fExFolderField).html(folderMapDiv + folderGridDiv + folderFileCountDiv);

                var windowHeight = $(window).height();
                var offsetTop = $('#' + wdgtConsts.fExContainer).offset().top;
                var availableHeight = windowHeight - offsetTop - 50;
                if (this.options.setDynamicHeight) {
                    $('#' + wdgtConsts.fExContainer).css('height', 'auto');
                    $('#' + wdgtConsts.fExDirectoryField + "," + '#' + wdgtConsts.fExDirectoryFieldDup).height(availableHeight);
                    $('#' + wdgtConsts.fExFolderField + "," + '#' + wdgtConsts.fExFolderFieldDup).height(availableHeight);
                    $('#' + wdgtConsts.fExDocumentField + "," + '#' + wdgtConsts.fExDocumentFieldDup).height(availableHeight);
                }
                this._load();
                var optns = this.options;
                if (optns.customScroll || optns.resize)
                    var intervalObj = setInterval(function () {
                        if ($('.fExRoot').length > 0 && $('.folderGridContainer').length > 0) {

                            if (optns.customScroll) {
                                $('.fExRoot').mCustomScrollbar({
                                    theme: "3d",
                                    axis: "yx",
                                    autoExpandHorizontalScroll: true,
                                    advanced: { autoExpandHorizontalScroll: true },
                                    scrollButtons: { enable: true },
                                    scrollbarPosition: "outside"
                                });

                                $('.folderGridContainer').mCustomScrollbar({
                                    theme: "3d",
                                    axis: "yx",
                                    autoExpandHorizontalScroll: true,
                                    advanced: { autoExpandHorizontalScroll: true },
                                    scrollButtons: { enable: true },
                                    scrollbarPosition: "outside"
                                });
                            }

                            if (optns.resize) {

                                $('#' + wdgtConsts.fExDirectoryField).resizable({
                                    handles: " e",
                                    maxWidth: optns.dirFieldMaxWidth,
                                    minWidth: optns.dirFieldMinWidth
                                });
                            }

                            clearInterval(intervalObj);

                        }
                    }, 50);
            },


            //Destroys the element -- jquery method
            _destroy: function () {
                this.options.widgetObj.remove();
            },

            //sets the options -- jquery method
            _setOptions: function () {
                this._superApply(arguments);
                this._refresh();
            },

            //Set the option --jquery method
            _setOption: function (key, value) {
                this._super(key, value);
            },

            //refresh the element with the new values --jquery method
            _refresh: function () {
                this._load();
            },

            //Events handler function custom function specific to the FEx
            handleEvents: function () {

                var optns = this.options;
                var self = this;

                this.element.find('#dirAddFiles').off('click').on('click', function (e) {
                    self.element.find('#fileBtn').click();
                    e.stopImmediatePropagation();
                    self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').slideUp();
                });

                this.element.find('#fileBtn').off('change').on('change', function (e) {
                    var files = this.files;
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        addFiles(file);
                        var row = "<tr class='file " + file.type.toLowerCase() + "'><td><div>" + wdgtConsts.gridHeaders.chkBox + "</div></td><td><div class='" + getImageClass(file.type, file.Format) + "'> </div></td><td class='fExResourceTitle'><div class='fExResourceTitleDiv'>" + file.name + "</div></td><td><div>" + self.getFormatedDate(file.lastModifiedDate) + "</div></td><td class='rowData' style='display:none'><div>" + JSON.stringify(file) + "</div></td></tr>";
                        $('#' + wdgtConsts.folderGrid).find('tbody').append(row);

                    }

                });

                this.element.find('.fExResourceFolder').off('click').on('click', function (e) {
                    optns.history = this;
                    $('#folder_Grid').find('thead th').removeClass('ascending').removeClass('descending');
                    $('#fEx_Document_Field_Content,#fEx_Document_Field_Title').empty();
                    e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();
                    var context = $(this);
                    if (context.hasClass('fExRoot')) {
                        context.children().toggle('medium');
                    } else {

                        if (context.hasClass('folderActive') && context.next().find('ul').length == 0)
                            return false;

                        context.parents('.ol').find('li div').removeClass('folderActive').addClass('folderDefault').next().addClass();

                        context.toggleClass('folderDefault').toggleClass('folderActive');

                        var isParent = false, parentImg;
                        if (context.next().find('li').length > 0) {
                            isParent = true;
                            if (context.next().find('ul').length > 0) {
                                context.next().toggle().children().children('ul').toggle();
                                parentImg = context.find('a').first().toggleClass("openImage");
                            }
                            else {
                                context.next().toggle();
                                context.find('a').first().toggleClass("openImage");
                            }
                        }

                        if (context.hasClass('folderActive')) {
                            var data = formFolderData(context.attr('path'));
                            if (self.options.validateGridData) {
                                var mod_Data = self.options.validateGridData(data);
                                if (mod_Data)
                                    data = mod_Data;
                            }
                            formFolderGrid(data);
                        }

                    }

                });

                this.element.find('.folderGrid').off('click').on('click', 'tbody tr', function (e) {
                    e.stopImmediatePropagation();

                    var context = this;
                    if (e.target.className != 'fExChkBox') {
                        $(context).find('.fExChkBox')[0].checked = !($(context).find('.fExChkBox')[0].checked);
                    }
                    $(context).toggleClass('selectedRow');



                    try {
                        var rowData = self.options.gridRows[$(context).index()];
                        $(context).attr('path', rowData.Path);
                    } catch (e) {
                        throw e;
                    }


                    var tr = context;
                    setTimeout(function () {
                        if ($('.folderGrid input:checked').length == 1)
                            showDocumentInfo();
                        else
                            $('#fEx_Document_Field_Content,#fEx_Document_Field_Title').empty();
                    }, 50);

                });

                this.element.find('.fExRoot .resourceRootName').off('click').on('click', function (e) {
                    removeActiveSelection();
                    $('.ol').children('li').children('.fExResourceFolder').each(function () {
                        $(this).find('a').first().removeClass("openImage");
                    });
                });

                
                $(this.element).off('click', '.folderGrid th').on('click', '.folderGrid th', function () {
                    if ($(this).hasClass('thCheckBox'))
                        return;

                    var text = $(this).text();
                    var member = '';
                    if (this.id) {
                        member = this.id;
                    }

                    var count = 0;

                    var filesNew = optns.files;

                    if ($('.folderActive').length > 0) {
                        path = $('.folderActive').attr('path');
                        filesNew = formFolderData(path).data;
                    }

                    if (filesNew) {
                        for (var i = 0; i < filesNew.length; i++) {
                            delete filesNew[i].Childs;
                        }

                        var orderedData;
                        if ($(this).hasClass('ascending')) {
                            $(this).parents('tr').find('th').removeClass('ascending').removeClass('descending');
                            orderedData = JSLINQ(filesNew).OrderByDescending(function (item) {
                                return item[member].toLowerCase();
                            }).items;
                            $(this).addClass('descending');
                        }
                        else {
                            $(this).parents('tr').find('th').removeClass('descending').removeClass('ascending');
                            orderedData = JSLINQ(filesNew).OrderBy(function (item) {
                                return item[member].toLowerCase();
                            }).items;
                            $(this).addClass('ascending');
                        }                        
                        formFolderGrid({ data: orderedData, title: self.element.find('#' + wdgtConsts.folderMap).text() });

                    }

                });

                this.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').off('click').on('click', function (e) {
                    e.stopImmediatePropagation();
                    $(this).children('li').slideDown();
                });

                this.element.find('.' + wdgtConsts.fExDirectorySortCntnr.replace(/_/g, "") + ' li').off('click').on('click', function (e) {
                    e.stopImmediatePropagation();
                    self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').slideUp();
                    var text = $(this).text();
                    var member = '';
                    if (this.id) {
                        member = this.id;
                    }
                    self.element.find('#folder_Grid').find('thead th').removeClass('ascending').removeClass('descending');
                    var count = 0;

                    var filesNew = optns.files;



                    for (var i = 0; i < filesNew.length; i++) {
                        delete filesNew[i].Childs;
                    }

                    var orderedData, type = 'ASC';
                    if ($(this).hasClass('ascending')) {
                        orderedData = JSLINQ(filesNew).OrderByDescending(function (item) {
                            return item[member].toLowerCase();
                        }).items;
                        $(this).removeClass('ascending');
                        $(this).addClass('descending');
                        type = 'DESC';
                    } else {
                        orderedData = JSLINQ(filesNew).OrderBy(function (item) {
                            return item[member].toLowerCase();
                        }).items;
                        $(this).removeClass('descending');
                        $(this).addClass('ascending');

                        type = 'ASC'
                    }

                    self.formDirectoryTree(orderedData, wdgtConsts.directoryTree);
                    self.element.find('#sortedBy').text("Sorted By: " + $(this).text() + "-" + type).attr('title', "Sorted By: " + $(this).text() + "-" + type);
                    self.handleEvents();
                });

                $(document).off('click').on('click', function () {
                    if (self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').is(':visible'))
                        self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').slideUp();

                    if (self.element.find('#alert').is(':visible')) {
                        setTimeout(function () {
                            self.element.find('#alert').hide(); $('#confirm').hide();
                        }, 1000);
                    }
                });

                this.element.find('#' + wdgtConsts.gridHeaders.selectAll).off('click').on('click', function (e) {
                    e.stopImmediatePropagation();
                    var selfN = this;
                    var trs = $('.folderGrid tbody tr');
                    trs.find('.' + wdgtConsts.gridHeaders.fExChkBox).each(function (e) {
                        this.checked = selfN.checked; return;
                    })
                    selfN.checked ? trs.addClass('selectedRow') : trs.removeClass('selectedRow');
                });


                //Menu Events
                this.element.find('#dirNewFolder').off('click').on('click', function (e) {
                    e.stopImmediatePropagation();
                    self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').slideUp();
                    var path = $('.folderActive').attr('path');

                    if (!path) {
                        path = optns.rootPath;
                        var li = "<li class='fExResource insertedField'><div class='fExResourceFolder folderDefault' path=''><a class='closeImage'></a><img class='fExFolderImg' src='/Scripts/FEx/Images/Folder.png'><a class='fExResourceTitle'><input type='text' id='folderText' path='" + path + "'/></a></div></li>";
                        self.element.find('.ol').append(li);
                    } else {
                        var li = "<li class='fExResourceFolder insertedField'><a class='closeImage'></a><img class='fExFolderImg' src='/Scripts/FEx/Images/Folder.png'><a class='fExResourceTitle'><input type='text' id='folderText' path='" + path + "'/></a></li>";
                        $('.folderActive').next('ul').show().append(li);
                    }

                    self.element.find('#folderText').unbind('change,keydown').change(function () {
                        if ($(this).val() == "") {
                            customAlert("Enter folder name");
                            return false;
                        }

                        var path = $(this).attr('path');
                        path = path + "/" + $(this).val();
                        $(this).parent().html($(this).val());
                        var postData = { updateType: 'newFolder', path: path, pathNew: '' };
                        if (self.options.onActionStart) {
                            var modFormData = self.options.onActionStart('newFolder', postData);
                            if (modFormData) {
                                formData = modFormData;
                                addFolder();
                            } else {
                                addFolder();
                            }
                        } else {
                            addFolder();
                        }
                        function addFolder() {
                            $.ajax({
                                url: optns.updateAction.createFolderUrl,
                                data: JSON.stringify(postData),
                                type: 'post',
                                contentType: 'application/JSON',
                                success: function () {
                                    customAlert("Action succeeded");
                                    self._load();
                                },
                                error: function () {
                                    customAlert("Error in executing the action");
                                }
                            });
                        }
                    }).focus().keydown(function (e) {
                        e.stopImmediatePropagation();
                        if (e.keyCode == 27) {
                            $('.insertedField').remove();
                        }
                    });
                });

                this.element.find('#dirDelete').off('click').on('click', function (e) {
                    e.stopImmediatePropagation();
                    self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').slideUp();
                    var path = [], folderActive = self.element.find('.folderActive');
                    path.push(folderActive.attr('path'));
                    var isValid = false,selectedRows=self.element.find('.selectedRow');
                    if (selectedRows.length > 0) {
                        isValid = true;
                        path = [];
                        
                        for (var i = 0; i < selectedRows.length; i++) {
                            var pathTemp = $(selectedRows[i]).attr('path');
                            path.push(pathTemp.replace(/\\/g, '/'));
                        }

                    }


                    if (!isValid && folderActive.length == 0) {
                        customAlert("Please select a folder to delete");
                        return false;
                    }

                    var confirmBox = "<div id='confirm'><div class='body'></div><div class='footer'><span class='btnPrimary' >Confirm</span><span class='btnSecondary'>Cancel</span></div></div>";
                    if (self.element.find('#confirm').length == 0)
                        self.element.find('.fExContainer').append(confirmBox);
                    var win = $(window);
                    self.element.find('#confirm').show().css({ left: (win.width() / 2) - self.element.find('#confirmBox').width() - 50, top: win.height() / 2 }).draggable();
                    self.element.find('#confirm').find('.body').html('Are you sure to delete ' + name);

                    self.element.find('.btnPrimary').unbind('click').click(function () {
                        $.ajax({
                            url: optns.updateAction.deleteUrl,
                            data: JSON.stringify({ updateType: 'delete', path: path[0], pathNew: null, paths: path }),
                            type: 'post',
                            contentType: 'application/JSON',
                            success: function () {
                                customAlert("Action succeeded");
                                self._load();
                            },
                            error: function () {
                                customAlert("Error in executing the action");
                            }
                        });
                        self.element.find('#confirm').hide();
                    });

                    self.element.find('.btnSecondary').unbind('click').click(function () {
                        self.element.find('#confirm').hide();
                    });


                });

                this.element.find('#dirRename').off('click').on('click', function (e) {
                    e.stopImmediatePropagation();
                    self.element.find('.' + wdgtConsts.fExToolOptions.replace(/_/g, "") + ' ul').children('li').slideUp();
                    var folderActive = $('.folderActive'), path = folderActive.attr('path'), selectedRow = self.element.find('.selectedRow');

                    var isValid = false;
                    if (selectedRow.length == 1) {
                        isValid = true;
                        path = selectedRow.attr('path');
                    }

                    if (!isValid && folderActive.length == 0) {
                        customAlert("Please select a folder to rename");
                        return false;
                    }

                    if (path) {
                        var obj = folderActive.children('.fExResourceTitle');
                        var childText = obj.children().text();
                        if (isValid) {
                            obj = selectedRow.children('.fExResourceTitle');
                            childText = '';
                        }
                        obj.html("<input type='text' length='" + folderActive.attr('length') + "' id='folderText' value='" + obj.text().replace(childText, '') + "' path='" + path + "'/>");
                        setTimeout(function () {
                            self.element.find('#folderText').focus();
                        }, 100);
                    }

                    self.element.find('#folderText').unbind('change,keydown').change(function () {

                        var obj = $('.folderActive');
                        var isFileChkReqd = false;
                        if ($($(this).parent())[0].nodeName.toLowerCase() == "td") {
                            obj = $($(this).parent().parent());
                            isFileChkReqd = true;
                        }

                        var path = obj.attr('path');
                        path = path.replace(/\\/g, '/');
                        var name = path.split('/')[path.split('/').length - 1]
                        if (name.indexOf('.') > 0 && isFileChkReqd && obj.hasClass('file')) {
                            var nameAry = name.split('.');
                            var format = nameAry[nameAry.length - 1];
                            name = name.replace('.' + format, '');
                        }
                        var pathN = path.replace(name, $(this).val());

                        $.ajax({
                            url: optns.updateAction.renameUrl,
                            data: JSON.stringify({ updateType: 'rename', path: obj.attr('path'), pathNew: pathN }),
                            type: 'post',
                            contentType: 'application/JSON',
                            success: function () {
                                customAlert("Action succeeded");
                                self._load();
                            },
                            error: function () {
                                customAlert("Error in executing the action");
                            }
                        });
                    }).keydown(function (e) {
                        e.stopImmediatePropagation();
                        if (e.keyCode == 27) {

                            if ($($(this).parent())[0].nodeName.toLowerCase() == "td") {
                                var obj = $($(this).parent().parent());
                                var path = obj.attr('path');
                                path = path.replace(/\\/g, '/');
                                var name = path.split('/')[path.split('/').length - 1];
                                if (name.indexOf('.') > 0 && obj.hasClass('file')) {
                                    var nameAry = name.split('.');
                                    var format = nameAry[nameAry.length - 1];
                                    name = name.replace('.' + format, '');
                                }
                                $(this).parent().html(name);
                            }
                            else {
                                var folderActive = self.element.find('.folderActive');
                                var length = folderActive.attr('length');
                                var path = folderActive.attr('path');
                                path = path.replace(/\\/g, '/');
                                var name = path.split('/')[path.split('/').length - 1];
                                $(this).parent().html(name + "(" + length + ")");
                            }
                        }
                        if (e.keyCode == 13) {
                           // $(this).change();
                        }
                    }).click(function (e) {
                        e.stopImmediatePropagation();
                    });
                });

                $('.fExFolderField,.fExDocumentField,.fExDirectoryField').off('click').on('mouseover', function (e) {
                    e.stopPropagation();
                    self.element.find('.fExDirectoryField,.fExFolderField,.fExDocumentField').removeClass('active');
                    $(this).addClass('active');
                });



                //Menu Events Ends

                function showDocumentInfo() {
                    var context = self.element.find('.folderGrid tbody tr.selectedRow');
                    var data = self.options.gridRows[$(context).index()];
                    self.element.find('#fEx_Document_Field_Title').text('').text(data.Name);
                    var html = "<div class='detailsCont'><b class='contentDiv'>Modified Date</b> <div class='contentDiv'> " +
                        self.getFormatedDate(data.LastModifiedDate) +
                        " </div> <br/></div class='contentDiv'><div class='detailsCont'><b class='contentDiv'> Created Date</b><div class='contentDiv'> "
                        + self.getFormatedDate(data.CreatedDate) + "</div> <br/></div><div class='detailsCont'> <b class='contentDiv'>File Format </b><div class='contentDiv'> "
                        + data.Format + "</div></div>";

                    if (self.options.documentInfoHandler) {
                        var mod_html = self.options.documentInfoHandler(self.options, data, html);
                        if (mod_html)
                            html = mod_html;
                    }
                    self.element.find('#fEx_Document_Field_Content').html('').html(html);
                }

                function formFolderGrid(folderData) {
                    var folderMap = self.element.find('#' + wdgtConsts.folderMap); folderMap.text("");
                    var data = folderData.data;
                    self.element.find('#' + wdgtConsts.folderMap).removeAttr('title');
                    self.element.find('#' + wdgtConsts.folderGrid).find('tbody').html('');
                    var fileCount = 0, folderCount = 0;
                    if (data) {
                        self.options.gridRows = data;
                        for (var i = 0; i < data.length; i++) {

                            var datum = data[i];
                            var name = datum.Name;

                            delete datum.Childs;
                            if (datum.Type == "File") {
                                fileCount++;
                                if (name.indexOf('.') > 0) {
                                    var nameAry = datum.Name.split('.');
                                    var format = nameAry[nameAry.length - 1];
                                    name = name.replace('.' + format, '');
                                }
                            }
                            else if (datum.Type == "Folder")
                                folderCount++;
                            var row = "";
                            var tds = "<td><div>"+ wdgtConsts.gridHeaders.chkBox + "</div></td>";
                            Object.keys(self.options._order).forEach(function (key) {
                                if (key == "Format") {
                                    tds = tds + " <td><div class='icons " + datum[key] + "Icon" + "'></div></td>";
                                }
                                else {
                                    var tdData = datum[key],editableClass='';
                                    if (self.options.gridTemplate[key]["format"]) {
                                        tdData = self.getFormatedDate(datum[key]);
                                    }
                                    if (self.options.gridTemplate[key]["updatable"])
                                    {
                                        editableClass = "class='fExResourceTitle'";
                                    }
                                    tds = tds + "<td " + editableClass + "><div> " + tdData + " </div></td>";
                                }

                            });
                            self.element.find('#' + wdgtConsts.folderGrid).find('tbody').append("<tr class='" + datum.Type.toLowerCase() + "'>" + tds + "</tr>");
                        }
                    }

                    if (folderData.title) {
                        folderMap.text(folderData.title);

                        if (checkOverflow(self.element.find('#' + wdgtConsts.folderMap)[0])) {
                            var orgText = self.element.find('#' + wdgtConsts.folderMap).text();
                            self.element.find('#' + wdgtConsts.folderMap).attr('title', orgText);
                        }

                        self.element.find('#folder_File_Count').text('').text("Files (" + fileCount + ") Folder (" + folderCount + ")");
                    }

                    moveItems();

                    dragDropFileHandler();

                }

                function moveItems() {
                    self.element.find('.fExResourceTitle div').draggable({
                        revert: 'invalid', opacity: 1,
                        helper: "clone", distance: 5,
                        containment: "document",
                        addClasses: false,
                        start: function () {

                        }
                    });


                    self.element.find(".folder,.fExResourceFolder").droppable({
                        hoverClass: "drop-hover",
                        drop: function (e, u) {
                            e.stopImmediatePropagation();
                            var target = $(e.target);
                            var source = $(u.helper);
                            var rowDataTarget;
                            if ($(target).hasClass('fExResource') || $(target).hasClass('fExResourceFolder')) {
                                rowDataTarget = { Path: $(target).attr('path') };
                            } else {
                                rowDataTarget = JSON.parse($(target).find('.rowData').text());
                            }
                            var rowDataSource = JSON.parse($(source).parents('tr').find('.rowData').text());
                            var pathN = rowDataTarget.Path + "/" + rowDataSource.Path.replace(/\\/g, '/').split('/')[rowDataSource.Path.replace(/\\/g, '/').split('/').length - 1];
                            update('move', rowDataSource.Path, pathN);
                            return false;
                        }
                    });
                }

                function dragDropFileHandler() {

                    self.element.find('#' + wdgtConsts.folderGrid).unbind('drop').on({
                        "drop": makeDrop,
                        "dragenter": ignoreDrag,
                        "dragover": ignoreDrag
                    });

                    self.element.find('#' + wdgtConsts.folderGrid).mouseout(function () {
                        $(this).removeClass('drop-hover');
                    });

                    function ignoreDrag(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        self.element.find('#' + wdgtConsts.folderGrid).addClass('drop-hover');
                    }


                    function makeDrop(e) {
                        try {
                            if (!e || !e.originalEvent.dataTransfer)
                                return false;

                            var fileList = e.originalEvent.dataTransfer.files, fileReader;


                            e.stopPropagation();
                            e.preventDefault();
                            files = fileList;
                            if (fileList.length > 0) {
                                for (var i = 0; i < fileList.length; i++) {

                                    var newFile = fileList[i];
                                    if (newFile) {
                                        addFiles(newFile);
                                        fileReader = new FileReader();
                                        fileReader.onloadend = handleReaderOnLoadEnd(newFile);
                                        fileReader.readAsDataURL(newFile);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            throw e;
                        }

                    }

                    function handleReaderOnLoadEnd(file) {
                        return function (event) {
                            var row = "<tr class='file " + file.type.toLowerCase() + "'><td><div>" + wdgtConsts.gridHeaders.chkBox + "</div></td><td><div class='" + getImageClass(file.type, file.Format) + "'></div></td><td class='fExResourceTitle'><div class='fExResourceTitleDiv'>" + file.name + "</div></td><td><div>" + self.getFormatedDate(file.lastModifiedDate) + "</div></td><td class='rowData' style='display:none'><div>" + JSON.stringify(file) + "</div></td></tr>";
                            self.element.find('#' + wdgtConsts.folderGrid).find('tbody').append(row);
                        };
                    }
                }

                function update(type, path, pathN) {
                    var postData = { updateType: type, path: path, pathNew: pathN };
                    if (self.options.onActionStart) {
                        var modFormData = self.options.onActionStart(type, postData);
                        if (modFormData) {
                            formData = modFormData;
                            updateFiles();
                        } else {
                            updateFiles();
                        }
                    } else {
                        updateFiles();
                    }
                    function updateFiles() {
                        $.ajax({
                            url: optns.updateAction.moveUrl,
                            data: JSON.stringify(postData),
                            type: 'post',
                            contentType: 'application/JSON',
                            success: function () {
                                customAlert("Action succeeded");
                                self._load();
                            },
                            error: function () {
                                customAlert("Error in executing the action");
                            }
                        });
                    }
                }

                function addFiles(file) {
                    var path = self.options.rootPath;
                    if (self.element.find('.folderActive').length > 0) {
                        path = self.element.find('.folderActive').attr('path');
                    }
                    var formData = new FormData();
                    formData.append("Path", path);
                    formData.append("FileUploaded", file);

                    if (self.options.onActionStart) {
                        var modFormData = self.options.onActionStart('fileAdd', formData);
                        if (modFormData) {
                            formData = modFormData;
                            addFiles();
                        } else {
                            addFiles();
                        }
                    } else {
                        addFiles();
                    }

                    function addFiles() {
                        $.ajax({
                            url: self.options.updateAction.addFile,
                            data: formData,
                            type: 'post',
                            dataType: "html",
                            contentType: false,
                            processData: false,
                            success: function () {
                                customAlert("Action succeeded");
                                self._load();
                            },
                            error: function () {
                                customAlert("Error in executing the action");
                            },
                            xhr: function () {
                                // get the native XmlHttpRequest object
                                var xhr = $.ajaxSettings.xhr();
                                // set the onprogress event handler
                                xhr.upload.onprogress = function (evt) {
                                    //console.log('progress', evt.loaded / evt.total * 100)
                                };
                                // set the onload event handler
                                xhr.upload.onload = function () {
                                    //console.log('DONE!')
                                };
                                // return the customized object
                                return xhr;
                            }
                        });
                    }
                }

                function checkOverflow(el) {
                    if (el) {
                        var curOverflow = el.style.overflow;
                        if (!curOverflow || curOverflow === "visible")
                            el.style.overflow = "hidden";

                        var isOverflowing = el.clientWidth < el.scrollWidth
                           || el.clientHeight + 8 < el.scrollHeight;


                        el.style.overflow = curOverflow;

                        return isOverflowing;
                    }

                }

                function formFolderData(path) {
                    var rootPath = optns.rootPath;
                    var pathNew = path.substr(rootPath.length, path.length - 1);
                    var ary = pathNew.split('/');

                    var mapTemp = ary.join(" > ");

                    var obj = optns.formatedData;

                    for (var i = 0; i < ary.length; i++) {
                        obj = obj[ary[i]]
                    }

                    return { data: obj, title: mapTemp };
                }

                function getImageClass(path, format) {
                    var type ='';
                    if (path)
                        type = path.toLowerCase();
                    else {
                        if (format)
                            type = format.split('.')[format.split('.').length - 1];
                    }
                    if (type == "file") {
                        type = format;
                    }                   

                    return "icons " + type + "Icon";

                    
                }

                setTimeout(function () {
                    removeActiveSelection();
                }, 0);


                function removeActiveSelection() {
                    self.element.find('.ol').children('li').children('.fExResourceFolder').next().css({ 'display': 'none' });
                    self.element.find('.ol').children('li').children('.fExResourceFolder').removeClass('folderActive').addClass('folderDefault');
                    self.element.find('#' + wdgtConsts.folderMap).text("").text("Root");
                    formFolderGrid({ data: optns.files, title: wdgtConsts.rootName });
                    self.element.find('#folder_Grid').find('thead th').removeClass('ascending').removeClass('descending');
                    self.element.find('#fEx_Document_Field_Content,#fEx_Document_Field_Title').empty();
                }

                dragDropFileHandler();
            },

            //Loads the data from server --jquery method
            _load: function () {
                var self = this;
                var optns = self.options;

                if (optns.onLoadStart) {
                    var temp_optns = optns.onLoadStart(optns);
                    if (temp_optns) {
                        optns = temp_optns;
                        dataCall();
                    } else {
                        dataCall();
                    }
                }
                else {
                    dataCall();
                }

                function dataCall() {
                    $.ajax({
                        url: optns.filesSrc,
                        data: optns.data,
                        type: optns.ajaxType || wdgtConsts.ajaxType,
                        dataType: wdgtConsts.loadDataType,
                        success: function (data) {
                            if (optns.onLoadEnd) {
                                var temp_Data = optns.onLoadEnd(data);
                                if (temp_Data)
                                    data = temp_Data;
                            }
                            optns.files = data.files;
                            optns.formatedData = formatFileDataObject(data.files);
                            var a = createTree(data.files);
                            self.handleEvents()
                            setTimeout(function () {
                                if (optns.history) {
                                    var path = $(optns.history).attr('path');
                                    $("div[path='"+path+"']").focus().click();

                                }
                            },500);
                        },
                        error: function (xhr, status, msg) {
                            throw msg;
                        }

                    });
                }


                //Creates a tree based on the file path
                var formatFileDataObject = function (files, obj) {

                    for (var i = 0; i < files.length; i++) {
                        if (!obj)
                            var obj = {};

                        var file = files[i];

                        if (file && file.Childs) {
                            obj[file.Name] = file.Childs;
                            formatFileDataObject(file.Childs, obj[file.Name]);
                        }
                    }

                    return obj;

                }

                function createTree(data) {
                    self.formDirectoryTree(data, wdgtConsts.directoryTree);
                    setTimeout(function () {
                        self.element.find('.fExRoot').click();
                    }, 25);
                    /*Setting the relative height of the contianers*/
                    self.element.find('#' + wdgtConsts.folderGridContainer).height($('#' + wdgtConsts.fExDirectoryField).height() - 42);
                }



            },

            //forms the directory tree -- custom funtion specific to FEx 
            formDirectoryTree: function (files, treeType) {
                var optns = this.options;

                var directoryObj;

                if (treeType == wdgtConsts.folderTree)
                    directoryObj = $('#' + wdgtConsts.fExFolderField);

                if (treeType == wdgtConsts.directoryTree)
                    directoryObj = $('#' + wdgtConsts.fExDirectoryField);


                directoryObj.html('');
                var strngBuilder = '';

                var recFormTree = function (fileData) {
                    if (fileData)
                        for (var i = 0; i < fileData.length; i++) {
                            var row = "";
                            var file = fileData[i];

                            if (file) {
                                if (file.Type && (file.Type.toLowerCase() == wdgtConsts.folderType)) {
                                    var count = '', length = 0;
                                    if (file.Childs && file.Childs.length) {
                                        count = "<span>(" + file.Childs.length + ")</span>";
                                        length = file.Childs.length;
                                    }
                                    row = "<li class='fExResource'><div length='" + length + "'+ path='" + file.Path + "' class='fExResourceFolder folderDefault'><a class='closeImage'></a><img class='fExFolderImg' src='/Scripts/FEx/Images/Folder.png'></img><a class='fExResourceTitle'>" + file.Name + count + "</a></div><ul class='fExResource'>";
                                    strngBuilder = strngBuilder + row;
                                    if (file.Childs)
                                        strngBuilder = recFormTree(file.Childs);
                                    strngBuilder = strngBuilder + "</ul></li>";
                                }

                                if (file.Type && treeType == wdgtConsts.folderTree && (file.Type.toLowerCase() == wdgtConsts.fileType)) {
                                    row = "<li class='fExResource'><div class='fExResourceFile'>" + file.Name + "</div></li>";
                                    strngBuilder = strngBuilder + row;
                                }
                            }
                        }

                    return strngBuilder;
                }

                strngBuilder = recFormTree(files);

                strngBuilder = "<div class='fExRoot'><a class='resourceRootName'>" + optns.rootName + "</a><div id='sortedBy'></div><div class='ol'>" + strngBuilder + "</div></div>";
                directoryObj.append(strngBuilder);

            },

            //gets the formated date -- custom funtion specific to FEx 
            getFormatedDate: function (data) {
                return $.datepicker.formatDate(this.options.dateFormat, new Date(data));
            }
        });

    if (!$)
        throw "Jquery not defined";
    if (!$.ui)
        throw "Jquery-UI not defined";

    var wdgtConsts = {
        loadDataType: "json",
        rootName: 'Root',
        fExContainer: "fEx_Container",
        fExDirectoryField: "fEx_Directory_Field",
        fExFolderField: "fEx_Folder_Field",
        fExDocumentField: "fEx_Document_Field",
        fExDirectoryFieldDup: "fEx_Directory_Field_Dup",
        fExFolderFieldDup: "fEx_Folder_Field_Dup",
        fExDocumentFieldDup: "fEx_Document_Field_Dup",
        fExDocumentFieldTitle: "fEx_Document_Field_Title",
        fExDocumentFieldContent: "fEx_Document_Field_Content",
        ajaxType: "post",
        folderType: "folder",
        fileType: "file",
        folderTree: "folder",
        directoryTree: "directory",
        folderMap: 'folder_Map',
        folderGridContainer: 'folder_Grid_Container',
        folderGrid: 'folder_Grid',
        fExToolBar: 'fEx_ToolBar',
        folderFileCount: 'folder_File_Count',
        fExDirectoryToolsCntnr: 'fEx_Directory_Tools_Cntnr',
        fExDirectorySortCntnr: 'fEx_Directory_Sort_Cntnr',
        fExDirectoryOptions: 'fEx_Directory_Options',
        fExToolOptions: 'fEx_Tool_Options',
        gridHeaders: {
            fileType: 'Type',
            fileName: 'Name',
            lastModified: 'Last Modified',
            selectAll: 'select_All_Grid_Items',
            fExChkBox: 'fExChkBox',
            chkBox: "<input type='checkbox' class='fExChkBox'/>",
            selectAllchkBox: "<input type='checkbox' id='select_All_Grid_Items'/>"
        }
    };
    //function to show the alert...
    function customAlert(text) {
        var win = $(window);
        $('#alert').show().text(text).css({ left: (win.width() / 2) - $('#alert').width(), top: win.height() / 2 });
    }
})(jQuery);
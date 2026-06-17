/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./biugu-core/src/admin/event/Occurrence.jsx"
/*!***************************************************!*\
  !*** ./biugu-core/src/admin/event/Occurrence.jsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Occurrence)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_TimePicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/TimePicker */ "./biugu-core/src/components/TimePicker.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function Occurrence({
  initialOccurrences = [],
  places = [],
  onOccurrencesChange = () => {} // Default tom funktion
}) {
  // State för listan med tillfällen
  const [occurrences, setOccurrences] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(initialOccurrences);

  // Form States
  const [repeatMode, setRepeatSelect] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('en_gang');
  const [locationId, setLocationSelect] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(places[0]?.id || '');
  const [customType, setCustomType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('veckovis');
  const [customInterval, setCustomInterval] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);

  // Datum & Tider (Använder WP:s inbyggda tidsväljare)
  const [startDate, setStartDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(new Date().toISOString());
  const [endDate, setEndDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(new Date().toISOString());
  const [startTime, setStartTime] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('09:00');
  const [endTime, setEndTime] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('17:00');
  const [excludedDates, setExcludedDates] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [tempExcludeDate, setTempExcludeDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');

  // Redigera ett tillfälle
  const [editingIndex, setEditingIndex] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [editForm, setEditForm] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    date: '',
    start_time: '',
    end_time: '',
    location: ''
  });
  const [notice, setNotice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const selectedPlace = places.find(p => p.id == locationId);

  // Rapportera förändringar uppåt till page.jsx / class-delta-sync när listan muteras
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    onOccurrencesChange(occurrences);
  }, [occurrences]);
  const triggerNotice = message => {
    setNotice(message);
    // Ta bort notisen automatiskt efter 4 sekunder
    setTimeout(() => setNotice(null), 6000);
  };

  // Lägg till uteslutet datum i listan
  const addExcludeDate = () => {
    if (tempExcludeDate && !excludedDates.includes(tempExcludeDate)) {
      setExcludedDates([...excludedDates, tempExcludeDate]);
      setTempExcludeDate('');
    }
  };

  // Starta redigering av en specifik rad
  const startEdit = (index, occ) => {
    setEditingIndex(index);
    setEditForm({
      ...occ
    });
  };

  // Spara ändringarna tillbaka till listan
  const saveEdit = index => {
    // Kontrollera om det nya redigerade formuläret krockar med någon ANNAN rad
    const isDuplicate = occurrences.some((occ, i) => i !== index &&
    // Ignorera raden vi redigerar
    occ.date === editForm.date && occ.start_time === editForm.start_time && occ.end_time === editForm.end_time && occ.location == editForm.location);
    if (isDuplicate) {
      triggerNotice("Detta tillfälle (datum/tid/plats) finns redan i listan!");
      return;
    }
    const updated = [...occurrences];
    updated[index] = editForm;
    updated.sort((a, b) => new Date(a.date) - new Date(b.date));
    setOccurrences(updated);
    setEditingIndex(null);
  };

  // Avbryt utan att spara
  const cancelEdit = () => {
    setEditingIndex(null);
  };

  // Huvudgeneratorn för att bygga tillfällen (Motsvarar din gamla JS-loop)
  const generateOccurrences = () => {
    if (!locationId) return;
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    // Vi använder state-variablerna startTime/endTime som du redan har (de strängar du valt i TimePickerField)
    const startDateStr = startObj.toISOString().split('T')[0];
    if (repeatMode === 'en_gang') {
      const isDuplicate = occurrences.some(occ => occ.date === startDateStr && occ.start_time === startTime && occ.end_time === endTime && occ.location == locationId);
      if (isDuplicate) {
        triggerNotice(`Tillfället den ${startDateStr} kl. ${startTime} finns redan.`);
        return;
      }
      const newOcc = {
        id: null,
        date: startDateStr,
        start_time: startTime,
        end_time: endTime,
        location: locationId
      };
      setOccurrences(prev => [...prev, newOcc].sort((a, b) => new Date(a.date) - new Date(b.date)));
    } else {
      const endParts = endObj.toISOString().split('T')[0].split('-');
      const endLoop = new Date(endParts[0], endParts[1] - 1, endParts[2], 23, 59, 59);
      let current = new Date(startDate);
      let skipDays = 7;
      if (repeatMode === 'manadsvis') skipDays = 'monthly';
      if (repeatMode === 'custom') {
        skipDays = customType === 'dagligen' ? customInterval : customInterval * 7;
      }
      const generated = [];
      let loopCount = 0;
      while (current <= endLoop && loopCount < 150) {
        const currentDateStr = current.toISOString().split('T')[0];

        // Dubblettkontroll i loopen
        const isDuplicate = occurrences.some(occ => occ.date === currentDateStr && occ.start_time === startTime && occ.end_time === endTime && occ.location == locationId);
        if (!isDuplicate && !excludedDates.includes(currentDateStr)) {
          generated.push({
            id: null,
            date: currentDateStr,
            start_time: startTime,
            end_time: endTime,
            location: locationId
          });
        }
        if (skipDays === 'monthly') {
          current.setMonth(current.getMonth() + 1);
        } else {
          current.setDate(current.getDate() + skipDays);
        }
        loopCount++;
      }
      if (generated.length === 0) {
        triggerNotice("Inga nya tillfällen genererade (dubbletter eller exkluderade datum).");
      }
      setOccurrences(prev => [...prev, ...generated].sort((a, b) => new Date(a.date) - new Date(b.date)));
    }
    setExcludedDates([]);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "biu-occurrence-manager",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "biugu-form-row",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        style: {
          width: '100%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: "Plats *",
          value: locationId,
          __next40pxDefaultSize: true,
          options: places.map(p => ({
            label: `${p.title} - ${p.street}`,
            value: p.id
          })),
          onChange: setLocationSelect
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        style: {
          width: '100%'
        },
        children: ["Omr\xE5de:", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "biugu-area-display",
          children: selectedPlace && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            children: selectedPlace.area
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "biu-form-row",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: "Repeterar",
        value: repeatMode,
        __next40pxDefaultSize: true,
        options: [{
          label: 'En gång',
          value: 'en_gang'
        }, {
          label: 'Veckovis',
          value: 'veckovis'
        }, {
          label: 'Månadsvis',
          value: 'manadsvis'
        }, {
          label: 'Custom',
          value: 'custom'
        }],
        onChange: setRepeatSelect
      })
    }), repeatMode === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "biu-form-row biu-custom-row",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: "Repetition *",
        value: customType,
        __next40pxDefaultSize: true,
        options: [{
          label: 'Dagvis',
          value: 'dagligen'
        }, {
          label: 'Veckovis',
          value: 'veckovis'
        }],
        onChange: setCustomType
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: "Intervall (Var X:e) *",
        type: "number",
        value: customInterval,
        min: "1",
        onChange: val => setCustomInterval(parseInt(val, 10) || 1)
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "biu-date-time-pickers",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "biu-col-half",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_TimePicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: "Starttid",
            value: startTime,
            onChange: setStartTime,
            interval: 15
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            style: {
              marginTop: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              className: "biu-label",
              children: "Startdatum"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "biu-date-picker",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.DatePicker, {
                currentDate: startDate,
                onChange: setStartDate,
                isInline: true
              })
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "biu-col-half",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_TimePicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: "Sluttid",
            value: endTime,
            onChange: setEndTime,
            interval: 15
          }), repeatMode !== 'en_gang' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            style: {
              marginTop: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
              className: "biu-label",
              children: "Slutdatum"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "biu-date-picker",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.DatePicker, {
                currentDate: endDate,
                onChange: setEndDate,
                isInline: true
              })
            })]
          })]
        })]
      })
    }), repeatMode !== 'en_gang' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "biu-exclude-section",
      style: {
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #ccd0d4',
        borderRadius: '4px',
        background: '#fcfcfc'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
        className: "biu-label",
        children: "Uteslut datum fr\xE5n serien"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        style: {
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: "V\xE4lj datum",
          type: "date",
          value: tempExcludeDate,
          onChange: setTempExcludeDate
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isSecondary: true,
          onClick: addExcludeDate,
          style: {
            height: '40px'
          },
          children: "L\xE4gg till"
        })]
      }), excludedDates.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "biu-exclude-pills",
        style: {
          marginTop: '10px'
        },
        children: excludedDates.map(date => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
          style: {
            display: 'inline-block',
            padding: '4px 8px',
            margin: '2px',
            background: '#e0e0e0',
            borderRadius: '12px',
            fontSize: '11px'
          },
          children: [date, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("b", {
            style: {
              marginLeft: '5px',
              cursor: 'pointer'
            },
            onClick: () => setExcludedDates(excludedDates.filter(d => d !== date)),
            children: " \xD7"
          })]
        }, date))
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "biu-action-area",
      style: {
        marginTop: '15px',
        textDirection: 'right'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "primary",
        onClick: generateOccurrences,
        children: "Generera tillf\xE4llen"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "biu-master-list-section",
      style: {
        marginTop: '30px'
      },
      children: [notice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        style: {
          marginBottom: '15px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
          status: "warning",
          onRemove: () => setNotice(null),
          children: notice
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("h4", {
        children: ["Tillagda Tillf\xE4llen (", occurrences.length, ")"]
      }), occurrences.map((occ, index) => {
        const isEditing = index === editingIndex;
        const matchedPlace = places.find(p => p.id == (isEditing ? editForm.location : occ.location));
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "biu-wire-item-row",
          style: {
            padding: '12px',
            background: isEditing ? '#f0f6fc' : '#fff',
            border: isEditing ? '1px solid #2271b1' : '1px solid #ccd0d4',
            marginBottom: '8px',
            borderRadius: '4px'
          },
          children: isEditing ?
          /*#__PURE__*/
          /* --- REDIGERINGSLÄGE --- */
          (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              style: {
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
                label: "Datum",
                type: "date",
                value: editForm.date,
                onChange: val => setEditForm({
                  ...editForm,
                  date: val
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_TimePicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
                label: "Start",
                value: editForm.start_time,
                onChange: val => setEditForm({
                  ...editForm,
                  start_time: val
                }),
                interval: 15
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_TimePicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
                label: "Slut",
                value: editForm.end_time,
                onChange: val => setEditForm({
                  ...editForm,
                  end_time: val
                }),
                interval: 15
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
                label: "Plats",
                value: editForm.location,
                options: places.map(p => ({
                  label: p.title,
                  value: p.id
                })),
                onChange: val => setEditForm({
                  ...editForm,
                  location: val
                }),
                __next40pxDefaultSize: true
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              style: {
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                isLink: true,
                isDestructive: true,
                onClick: cancelEdit,
                children: "Avbryt"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                variant: "primary",
                onClick: () => saveEdit(index),
                children: "Spara"
              })]
            })]
          }) :
          /*#__PURE__*/
          /* --- VANLIGT VISNINGSLÄGE --- */
          (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              onClick: () => startEdit(index, occ),
              style: {
                cursor: 'pointer',
                flex: 1
              },
              title: "Klicka f\xF6r att \xE4ndra tillf\xE4lle",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                children: occ.date
              }), " \u2014 Kl ", occ.start_time, " - ", occ.end_time, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                style: {
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '2px'
                },
                children: [matchedPlace ? `${matchedPlace.area} - ${matchedPlace.title}` : 'Okänd plats', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                  style: {
                    color: '#2271b1',
                    marginLeft: '10px'
                  },
                  children: "\u2014 \u270E \xC4ndra"
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              isDestructive: true,
              size: "Small",
              onClick: () => setOccurrences(occurrences.filter((_, i) => i !== index)),
              children: "\xD7"
            })]
          })
        }, index);
      })]
    })]
  });
}

/***/ },

/***/ "./biugu-core/src/admin/settings/page.jsx"
/*!************************************************!*\
  !*** ./biugu-core/src/admin/settings/page.jsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AdminApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const StatCard = ({
  label,
  value,
  status = 'default'
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
  className: `biugu-stat-card ${status}`,
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "biugu-stat-label",
    children: label
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "biugu-stat-value",
    children: value
  })]
});
const Badge = ({
  status,
  label
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
  className: `biugu-badge biugu-badge-${status}`,
  children: label
});
const ActionRow = ({
  name,
  description,
  children,
  last = false
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
  className: `biugu-action-row ${last ? 'last' : ''}`,
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "biugu-action-info",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "biugu-action-name",
      children: name
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "biugu-action-desc",
      children: description
    })]
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "biugu-action-actions",
    children: children
  })]
});
const Toast = ({
  message,
  type
}) => {
  if (!message) return null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: `biugu-toast biugu-toast-${type}`,
    children: message
  });
};
const LogEntry = ({
  entry
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
  className: "biugu-log-entry",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
    className: "biugu-log-time",
    children: entry.time
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
    className: "biugu-log-msg",
    children: entry.msg
  })]
});
function AdminApp() {
  const [stats, setStats] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    event_total: 0,
    occurrence_total: 0
  });
  const [loadingStats, setLoadingStats] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [syncing, setSyncing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [clearing, setClearing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [toast, setToast] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    message: '',
    type: 'success'
  });
  const [log, setLog] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const addLog = msg => {
    const time = new Date().toLocaleTimeString('sv-SE');
    setLog(prev => [{
      time,
      msg
    }, ...prev.slice(0, 19)]);
  };
  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type
    });
    setTimeout(() => setToast({
      message: '',
      type: 'success'
    }), 3500);
  };
  const fetchStats = async () => {
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/biugu/v1/stats'
      });
      setStats(data);
    } catch (error) {
      addLog('Kunde inte hämta statistik.');
    } finally {
      setLoadingStats(false);
    }
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchStats();
  }, []);
  const handleSync = async () => {
    setSyncing(true);
    addLog('Startar schema-synk…');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/biugu/v1/sync-schema',
        method: 'POST'
      });
      showToast('Pods-schema uppdaterat');
      addLog('Schema synkat utan fel.');
      fetchStats();
    } catch (error) {
      addLog(`Fel: ${error?.message || 'okänt fel'}`);
      showToast('Fel vid synk', 'error');
    } finally {
      setSyncing(false);
    }
  };
  const handleClearCache = async () => {
    setClearing(true);
    addLog('Rensar tillfällescache…');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/biugu/v1/clear-cache',
        method: 'POST'
      });
      showToast('Cache rensad');
      addLog('Cache rensad.');
    } catch (error) {
      addLog(`Fel: ${error?.message || 'okänt fel'}`);
      showToast('Fel vid cacherensning', 'error');
    } finally {
      setClearing(false);
    }
  };
  const handleExport = async () => {
    addLog('Exporterar event-data…');
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/biugu/v1/export',
        method: 'GET'
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'biugu-export.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Export laddas ned');
      addLog('Export klar.');
    } catch (error) {
      addLog(`Fel: ${error?.message || 'okänt fel'}`);
      showToast('Fel vid export', 'error');
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "biugu-wrap",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Toast, {
      message: toast.message,
      type: toast.type
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "biugu-grid",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StatCard, {
        label: "Pods-schema",
        value: "Synkat",
        status: "ok"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StatCard, {
        label: "Event (totalt)",
        value: loadingStats ? '...' : stats.event_total
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StatCard, {
        label: "Tillf\xE4llen (totalt)",
        value: loadingStats ? '...' : stats.occurrence_total
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "biugu-card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "card-title",
        children: "Schema & data"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "Synka Pods-schema",
        description: "Uppdaterar struktur mot databasen",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "biugu-btn-primary",
          onClick: handleSync,
          disabled: syncing,
          children: syncing ? 'Synkroniserar…' : 'Synka'
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "Rensa tillf\xE4llescache",
        description: "Tvingar omgenerering av recurring events",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "biugu-btn",
          onClick: handleClearCache,
          disabled: clearing,
          children: clearing ? 'Rensar…' : 'Rensa'
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "Exportera event-data",
        description: "Ladda ned som JSON",
        last: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "biugu-btn",
          onClick: handleExport,
          children: "Exportera"
        })
      }), log.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "biugu-log-container",
        children: log.map((entry, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(LogEntry, {
          entry: entry
        }, i))
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "biugu-card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "biugu-card-title",
        children: "Systemstatus"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "Pods",
        description: "Plugin aktivt",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Badge, {
          status: "ok",
          label: "Aktivt"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "REST API",
        description: "/biugu/v1",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Badge, {
          status: "ok",
          label: "Tillg\xE4ngligt"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "Classic editor",
        description: "Gutenberg inaktiverat",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Badge, {
          status: "ok",
          label: "Aktivt"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActionRow, {
        name: "WP_DEBUG",
        description: "Debug-l\xE4ge p\xE5",
        last: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Badge, {
          status: "warn",
          label: "P\xE5"
        })
      })]
    })]
  });
}

/***/ },

/***/ "./biugu-core/src/components/TimePicker.jsx"
/*!**************************************************!*\
  !*** ./biugu-core/src/components/TimePicker.jsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimePickerField)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function TimePickerField({
  label,
  value,
  onChange,
  interval = 15,
  startHour = 6,
  endHour = 23
}) {
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const parseValue = val => {
    if (!val) return {
      hour: startHour,
      min: 0
    };
    const [h, m] = val.split(':').map(Number);
    return {
      hour: h,
      min: m
    };
  };
  const {
    hour: selHour,
    min: selMin
  } = parseValue(value);
  const selectHour = h => {
    // Använd det nuvarande valda värdet eller fallback till 00
    const m = selMin.toString().padStart(2, '0');
    const hStr = h.toString().padStart(2, '0');
    onChange(`${hStr}:${m}`);
  };
  const selectMin = m => {
    // Använd det nuvarande valda värdet eller fallback till 00
    const h = selHour.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    onChange(`${h}:${mStr}`);
  };
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);
  const minutes = [];
  for (let m = 0; m < 60; m += interval) minutes.push(m);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    ref: ref,
    style: s.wrap,
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: s.label,
      children: label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
      style: s.field,
      onClick: () => setOpen(!open),
      type: "button",
      "aria-haspopup": "true",
      "aria-expanded": open,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        style: s.fieldValue,
        children: value || '--:--'
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        "aria-hidden": "true",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle", {
          cx: "12",
          cy: "12",
          r: "10"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("polyline", {
          points: "12 6 12 12 16 14"
        })]
      })]
    }), open && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      style: s.popover,
      role: "dialog",
      "aria-label": "V\xE4lj tid",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        style: s.hoursScroll,
        children: hours.map(h => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          style: {
            ...s.hourBtn,
            ...(h === selHour ? s.hourBtnActive : {})
          },
          onClick: () => selectHour(h),
          children: h.toString().padStart(2, '0')
        }, h))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        style: s.minutesWrap,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          style: s.minutesLabel,
          children: "Minuter"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          style: s.minuteGrid,
          children: minutes.map(m => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            style: {
              ...s.minBtn,
              ...(m === selMin ? s.minBtnActive : {})
            },
            onClick: () => selectMin(m),
            children: m.toString().padStart(2, '0')
          }, m))
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        style: s.footer,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
          type: "button",
          style: s.confirmBtn,
          onClick: () => setOpen(false),
          children: ["V\xE4lj ", value]
        })
      })]
    })]
  });
}
const s = {
  wrap: {
    position: 'relative',
    display: 'inline-block',
    minWidth: 140
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#1d2327',
    marginBottom: 6,
    display: 'block'
  },
  field: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '9px 12px',
    background: '#fff',
    border: '1px solid #8c8f94',
    borderRadius: 2,
    fontSize: 15,
    fontWeight: 500,
    color: '#1d2327',
    cursor: 'pointer',
    gap: 8
  },
  fieldValue: {
    flex: 1,
    textAlign: 'left'
  },
  popover: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    zIndex: 9999,
    background: '#fff',
    border: '1px solid #dcdcde',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    minWidth: 220,
    overflow: 'hidden'
  },
  hoursScroll: {
    display: 'flex',
    overflowX: 'auto',
    borderBottom: '1px solid #f0f0f1',
    scrollbarWidth: 'none'
  },
  hourBtn: {
    flexShrink: 0,
    padding: '9px 10px',
    fontSize: 13,
    fontWeight: 500,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#646970',
    transition: 'background 0.1s',
    minWidth: 36,
    textAlign: 'center'
  },
  hourBtnActive: {
    background: '#f0f6fc',
    color: '#2271b1'
  },
  minutesWrap: {
    padding: '10px 12px'
  },
  minutesLabel: {
    fontSize: 12,
    color: '#646970',
    marginBottom: 8
  },
  minuteGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6
  },
  minBtn: {
    padding: '6px 10px',
    fontSize: 13,
    fontWeight: 500,
    background: 'transparent',
    border: '1px solid #dcdcde',
    borderRadius: 4,
    cursor: 'pointer',
    color: '#1d2327',
    minWidth: 52,
    textAlign: 'center'
  },
  minBtnActive: {
    background: '#f0f6fc',
    border: '1px solid #2271b1',
    color: '#2271b1'
  },
  footer: {
    padding: '8px 12px',
    borderTop: '1px solid #f0f0f1',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  confirmBtn: {
    fontSize: 13,
    padding: '6px 14px',
    borderRadius: 4,
    border: '1px solid #2271b1',
    background: '#f0f6fc',
    color: '#2271b1',
    cursor: 'pointer',
    fontWeight: 500
  }
};

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/api-fetch"
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["apiFetch"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./biugu-core/src/index.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _admin_settings_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin/settings/page */ "./biugu-core/src/admin/settings/page.jsx");
/* harmony import */ var _admin_event_Occurrence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./admin/event/Occurrence */ "./biugu-core/src/admin/event/Occurrence.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const checkElements = () => {
  const adminRoot = document.getElementById('biugu-admin-root');
  const eventRoot = document.getElementById('biu-event-editor-root');

  // Hämta platser från det globala objektet vi skickade med PHP
  const places = window.biuguEventData?.places || [];
  if (adminRoot) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(adminRoot).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_admin_settings_page__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
  }
  if (eventRoot) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(eventRoot).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_admin_event_Occurrence__WEBPACK_IMPORTED_MODULE_2__["default"], {
      initialOccurrences: [],
      places: places // Använd variabeln vi hämtade ovan!
      ,
      onOccurrencesChange: data => {
        const input = document.getElementById('biu-occurrences-transport-field');
        if (input) {
          input.value = JSON.stringify(data);
        }
      }
    }));
  }
};
window.addEventListener('load', checkElements);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map
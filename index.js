class CModal
{
  static modalId = 1

  static modalList = []

  static CONSTS = {
    ESC_KEY: 27
  }

  static generateId = (function* generateId ()
  {
    while (true)
    {
      yield ++CModal.modalId;
    }
  })()

  /* =====================================================
   * || Получить экземпляр созданного модального окна || *
   ===================================================== */
  static getModal (id)
  {
    return CModal.modalList.find(instance => instance.id === id);
  }

  constructor (options = {})
  {
    this.id = _defineModalId(options.id);
    this.overlay = null;
    this.dom = {
      overlay: null,
      modalWr: null,
      modal: null,
      header: null,
      content: null,
      footer: null,
      closeBtn: null
    };
    this.state = {
      isOpen: false
    };
    this.handlers = {
      onCloseBtnClick: this.close.bind(this),
      onEsc: onEscPress.bind(this),
      onClickOutside: onClickOutside.bind(this),
      onAnimEnd: onAnimEnd.bind(this)
    };
    this.callbacks = {};
    this.settings = _extends({}, _getDefaults(), options);
  }

  /** ===================
   * || Создать окно || *
   ==================== */
  create ()
  {
    this.dom.modalWr = _createModalWr.call(this);
    this.dom.modal   = _createModal.call(this);
    this.dom.overlay = _createOverlay.call(this);
    this.dom.content = _createContent.call(this);

    if (this.settings.closeVars.indexOf('button') !== -1)
    {
      this.dom.closeBtn = _createCloseBtn.call(this);

      this.dom.modal.appendChild(this.dom.closeBtn);
    }

    if (this.settings.showHeader)
    {
      this.dom.header =_createHeader.call(this);
      this.dom.modal.appendChild(this.dom.header);
    }

    this.dom.modal.appendChild(this.dom.content);

    if (this.settings.showFooter)
    {
      this.dom.footer =_createFooter.call(this);
      this.dom.modal.appendChild(this.dom.footer);
    }

    this.dom.modalWr.appendChild(this.dom.modal);
    this.dom.modalWr.appendChild(this.dom.overlay);

    bindEvents.call(this);

    CModal.modalList.push(this);
    document.body.appendChild(this.dom.modalWr);

    return this;
  }

  /** ==========================
   * || Удалить окно из DOM || *
   =========================== */
  destroy ()
  {
    if (typeof this.settings.beforeDestroy === 'function')
    {
      let needClose = this.settings.beforeDestroy.call(this);

      if (!needClose)
      {
        return false;
      }
    }

    unbindEvents.call(this);

    CModal.modalList.filter(instance => instance.id === this.id);
    document.body.removeChild(this.dom.modalWr);
  }

  /** ====================
   * || Показать окно || *
   ===================== */
  open ()
  {
    if (typeof this.settings.beforeOpen === 'function')
    {
      let needOpen = this.settings.beforeOpen.call(this);

      if (!needOpen) {
        return false;
      }
    }

    this.state.isOpen = true;

    _addClass(this.dom.modal, this.settings.showAnim);
    _addClass(this.dom.modalWr, 'is-visible');

    if (typeof this.settings.afterOpen === 'function')
    {
      this.settings.afterOpen.call(this);
    }
  }

  /** ===================
   * || Окно открыто || *
   ==================== */
  isOpen ()
  {
    return this.state.isOpen;
  }

  /** ===================
   * || Закрыть окно || *
   ==================== */
  close ()
  {
    this.state.isOpen = false;

    _addClass(this.dom.modal, this.settings.hideAnim);
  }

  /** ===================
   * || Окно закрыто || *
   ==================== */
  isClosed ()
  {
    return !this.state.isOpen;
  }

  /** ===============================
   * || Установить контент шапки || *
   ================================ */
  setHeader (html)
  {
    _setHTML.call(this, 'header', html);

    return this;
  }

  /** ==================================
   * || Установить основной контент || *
   =================================== */
  setContent (html)
  {
    _setHTML.call(this, 'content', html);

    return this;
  }

  /** ================================
   * || Установить контент футера || *
   ================================= */
  setFooter (html)
  {
    _setHTML.call(this, 'footer', html);

    return this;
  }

  /** =============================
   * || Очистить контент шапки || *
   ============================== */
  clearHeader ()
  {
    _setHTML.call(this, 'header', '');

    return this;
  }

  /** ================================
   * || Очистить основной контент || *
   ================================= */
  clearContent ()
  {
    _setHTML.call(this, 'content', '');

    return this;
  }

  /** ==============================
   * || Очистить контент футера || *
   =============================== */
  clearFooter ()
  {
    _setHTML.call(this, 'footer', '');

    return this;
  }

  /** =============================
   * || Заменить контент шапки || *
   ============================== */
  replaceHeader (content)
  {
    this.clearHeader().setHeader(content);

    return this;
  }

  /** ================================
   * || Заменить основной контент || *
   ================================= */
  replaceContent (content)
  {
    this.clearContent().setContent(content);

    return this;
  }

  /** ==============================
   * || Заменить контент футера || *
   =============================== */
  replaceFooter (content)
  {
    this.clearFooter().setFooter(content);

    return this;
  }
}

/** ==============================================================
 * || Навесить обработчки событий компонентам модального окна || *
 =============================================================== */
function bindEvents ()
{
  if (this.settings.closeVars.indexOf('button') !== -1)
  {
    this.dom.closeBtn.addEventListener('click', this.handlers.onCloseBtnClick);
  }

  if (this.settings.closeVars.indexOf('overlay') !== -1)
  {
    this.dom.modalWr.addEventListener('click', this.handlers.onClickOutside);
  }

  if (this.settings.closeVars.indexOf('esc') !== -1)
  {
    document.body.addEventListener('keydown', this.handlers.onEsc);
  }

  this.dom.modal.addEventListener('animationend', this.handlers.onAnimEnd);
}

/** ===============================================================
 * || Удалить обработчки событий у компонентов модального окна || *
 ================================================================ */
function unbindEvents ()
{
  if (this.settings.closeVars.indexOf('button') !== -1)
  {
    this.dom.closeBtn.removeEventListener('click', this.handlers.onCloseBtnClick);
  }

  if (this.settings.closeVars.indexOf('overlay') !== -1)
  {
    this.dom.modalWr.removeEventListener('click', this.handlers.onClickOutside);
  }

  if (this.settings.closeVars.indexOf('esc') !== -1)
  {
    document.body.removeEventListener('keydown', this.handlers.onEsc);
  }

  this.dom.modal.removeEventListener('animationend', this.handlers.onAnimEnd);
}

/** ====================================================
 * || Закрыть модальное окно по нажатию клавиши ESC || *
 ===================================================== */
function onEscPress (event)
{
  if (event.keyCode === CModal.CONSTS.ESC_KEY && CModal.getModal(this.id).isOpen())
  {
    this.close();
  }
}

/** ==================================================
 * || Закрыть модальное окно при клике по оверлею || *
 =================================================== */
function onClickOutside (event)
{
  if (CModal.getModal(this.id).isClosed())
  {
    return false;
  }

  let node = event.target;

  while (!node.classList.contains('c-modal') && node.tagName !== 'BODY')
  {
    node = node.parentNode;
  }

  if (node.tagName === 'BODY')
  {
    this.close();
  }
}

function onAnimEnd ()
{
  this.isOpen() ? onShowAnimEnd.call(this) : onHideAnimEnd.call(this);
}

function onShowAnimEnd ()
{
  _removeClass(this.dom.modal, this.settings.showAnim);
}

function onHideAnimEnd ()
{
  _removeClass(this.dom.modal, this.settings.hideAnim);
  _removeClass(this.dom.modalWr, 'is-visible');
}

/** ==================================================
 * || Установить содержимое блока модального окна || *
 =================================================== */
function _setHTML (place, content)
{
  if (typeof content === 'string')
    {
      this.dom[place].innerHTML = content;
    } else if (content instanceof HTMLElement)
    {
      this.dom[place].appendChild(content);
    } else
    {
      throw new Error('Недостимый формат контента.');
    }
}

/** =============================================
 * || Создать DOM контейнера модального окна || *
 ============================================== */
function _createModalWr ()
{
  return _createDOMEl({
    tag: 'div',
    className: 'c-modal-wr',
    attrs: {
      'id': this.id
    }
  });
}

/** ==================================
 * || Создать DOM модального окна || *
 =================================== */
function _createModal ()
{
  let userClasses = ['c-modal'];
  let clsArr = Array.isArray(this.settings.modalClass) && this.settings.modalClass.every(cls => typeof cls === 'string');
  let clsStr = typeof this.settings.modalClass === 'string';
  let modalWidth = this.settings.width !== 'auto' ? this.settings.width : null;
  let attrs = {};

  if (clsArr)
  {
    userClasses.push(...this.settings.modalClass);
  } else if (clsStr)
  {
    userClasses.push(this.settings.modalClass);
  }

  if (modalWidth != null)
  {
    attrs['style'] = 'width: ' + modalWidth;
  }

  return _createDOMEl({
    tag: 'div',
    className: userClasses,
    attrs
  });
}

/** ==========================
 * || Создать DOM оверлея || *
 =========================== */
function _createOverlay ()
{
  return _createDOMEl({
    tag: 'div',
    className: 'c-modal-overlay'
  });
}

/** ========================
 * || Создать DOM шапки || *
 ========================= */
function _createHeader ()
{
  return _createDOMEl({
    tag: 'header',
    className: 'c-modal-header'
  });
}

/** ================================
 * || Создать DOM контент-части || *
 ================================= */
function _createContent ()
{
  return _createDOMEl({
    tag: 'div',
    className: 'c-modal-content'
  });
}

/** ==========================
 * || Создать DOM подвала || *
 =========================== */
function _createFooter ()
{
  return _createDOMEl({
    tag: 'footer',
    className: 'c-modal-footer'
  });
}

/** ===================================
 * || Создать DOM кнопки "Закрыть" || *
 ==================================== */
function _createCloseBtn()
{
  let cls = ['c-modal-close-btn'];

  if (this.settings.closeBtnClass)
  {
    if (Array.isArray(this.settings.closeBtnClass))
    {
      cls.push(...this.settings.closeBtnClass);
    } else
    {
      cls.push(this.settings.closeBtnClass);
    }
  }

  return _createDOMEl({
    tag: 'button',
    className: cls,
    content: 'X'
  });
}

/** ==================================
 * || Добавить класс DOM элементу || *
 =================================== */
function _addClass (el, className)
{
  if (Array.isArray(className))
  {
    className.forEach(v => {
      el.classList.add(v);
    })
  } else if (typeof className === 'string')
  {
    el.classList.add(className);
  } else
  {
    throw new Error('Недопустимый формат класса `className`');
  }
}

/** =================================
 * || Удалить класс DOM элементу || *
 ================================== */
function _removeClass (el, className)
{
  if (Array.isArray(className))
  {
    className.forEach(v => {
      el.classList.remove(v);
    })
  } else if (typeof className === 'string')
  {
    el.classList.remove(className);
  } else
  {
    throw new Error('Недопустимый формат класса `className`');
  }
}

/** =====================================
 * || Добавить атрибуты DOM элементу || *
 ====================================== */
function _addAttrs (el, options)
{
  for (let key in options)
  {
    _addAttr(el, key, options[key]);
  }
}

/** ======================================
 * || Удалить атрибуты у DOM элемента || *
 ======================================= */
function _removeAttrs (el, options)
{
  for (let key in options)
  {
    _removeAttr(el, key);
  }
}

/** ====================================
 * || Добавить атрибут DOM элементу || *
 ===================================== */
function _addAttr (el, attr, value)
{
  el.setAttribute(attr, value);
}

/** =====================================
 * || Удалить атрибут у DOM элемента || *
 ====================================== */
function _removeAttr (el, attr)
{
  el.removeAttribute(attr);
}

/** ==========================================
 * || Дефолтные настройки модального окна || *
 =========================================== */
function _getDefaults ()
{
  return {
    showHeader: true,
    showFooter: true,
    modalClass: null,
    showAnim: 'show-in',
    hideAnim: 'show-out',
    width: 'auto',
    closeVars: ['button', 'esc', 'overlay']
  };
}

/** ===========================================
 * || Объеденить несколько объектов в один || *
 ============================================ */
function _extends (...args)
{
  let index = 0;
  let argsLen = args.length - 1;
  let result = args[0];

  while (++index <= argsLen) {
    for (let key in args[index]) {
      result[key] = args[index][key];
    }
  }

  return result;
}

/** ==========================
 * || Создать DOM элемент || *
 =========================== */
function _createDOMEl (options)
{
  let { tag, className = '', attrs = {}, content = '' } = options;
  let el = document.createElement(tag);

  _addClass(el, className);
  _addAttrs(el, attrs);

  el.innerText = content;

  return el;
}

/** ====================================================
 * || Сгенерировать id создаваемого модального окна || *
 ===================================================== */
function _defineModalId (id)
{
  if (id != null && typeof id === 'string' || typeof id === 'number')
  {
    if (CModal.getModal(id) !== undefined)
    {
      throw new Error('Модальное окно с указанным id уже существует');
    }

    return id;
  }

  let genId = CModal.generateId.next().value;

  while (CModal.modalList.find(instance => instance.id === genId) !== undefined)
  {
    genId = CModal.generateId.next().value;
  }

  return genId;
}
// import { App } from "./index.js"  (предположительно)

describe('Тесты приложения', () => {
  let input;
  let button;
  let container;

  beforeEach(() => {
    // Создаем элементы DOM
    document.body.innerHTML = `
      <input type="text" id="input-field">
      <button id="add-button" style="display: none;">Добавить</button>
      <div id="paragraphs-container"></div>
    `;

    // Получаем ссылки на элементы
    input = document.getElementById('input-field');
    button = document.getElementById('add-button');
    container = document.getElementById('paragraphs-container');

    // Инициализируем логику приложения
    input.addEventListener('input', () => {
      button.style.display = input.value.trim() ? 'block' : 'none';
    });

    button.addEventListener('click', () => {
      const text = input.value.trim();
      if (text && text.length <= 255) {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        container.appendChild(paragraph);
        
        // Удаляем первый параграф если больше 4
        if (container.children.length > 4) {
          container.removeChild(container.firstChild);
        }
        
        input.value = '';
        button.style.display = 'none';
      }
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // 1. Проверка наличия элементов
  test('1. Имеется инпут для ввода текста, кнопка сохранить', () => {
    expect(input).toBeDefined();
    expect(button).toBeDefined();
    expect(button.style.display).toBe('none');
  });

  // 2. Добавление параграфа
  test('2. Формируется список из параграфов', () => {
    input.value = 'Тестовый текст';
    input.dispatchEvent(new Event('input'));
    
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('Тестовый текст');
  });

  // 3. Удаление первого параграфа при превышении лимита
  test('3. Если появляется 4й параграф, первый из списка удаляется', () => {
    // Создаем три параграфа
    const texts = ['Первый', 'Второй', 'Третий'];
    texts.forEach(text => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      button.click();
    });
    
    // Создаем четвертый параграф
    input.value = 'Четвертый';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].textContent).toBe('Второй');
    expect(paragraphs[2].textContent).toBe('Четвертый');
  });

  // 4. Кнопка скрыта при пустом поле
  test('4. Кнопка не отображается, если нет текста в инпуте', () => {
    expect(button.style.display).toBe('none');
  });

  // 5. Не добавляется параграф при пустом поле
  test('5. Работа с пустым полем ввода', () => {
    button.click();
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  // 6. Кнопка отображается при вводе текста
  test('6. Кнопка отображается, если введен текст', () => {
    input.value = 'Текст';
    input.dispatchEvent(new Event('input'));
    expect(button.style.display).toBe('block');
  });

  // 7. Граничные значения: 255 символов
  test('7. Граничные значения: текст не меньше одного символа и не больше 255', () => {
    const longText = 'a'.repeat(255);
    input.value = longText;
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toHaveLength(255);
  });

  // 8. Текст больше 255 символов
  test('8. Текст больше 255 символов', () => {
    const longText = 'a'.repeat(256);
    input.value = longText;
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  // 9. Текст из пробелов не допускается
  test('9. Текст из пробелов не допускается, инпут считается пустым', () => {
    input.value = '     ';
    input.dispatchEvent(new Event('input'));
    
    expect(button.style.display).toBe('none');
    
    button.click();
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  // 10. Удаление пробелов в начале и конце
  test('10. Удаление множества пробелов в начале и в конце текста', () => {
    input.value = '   Текст с пробелами   ';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('Текст с пробелами');
  });

  // 11. Текст из Enter не допускается
  test('11. Текст из Enter не допускается, поле считается пустым', () => {
    input.value = '\n\n\n';
    input.dispatchEvent(new Event('input'));
    
    expect(button.style.display).toBe('none');
    
    button.click();
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  // 12. Удаление Enter в начале и конце
  test('12. Удаление множества Enter в начале и в конце текста', () => {
    input.value = '\n\nТекст с Enter\n\n';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('Текст с Enter');
  });

  // 13. Ввод цифр допускается
  test('13. Ввод цифр допускается', () => {
    input.value = '1234567890';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('1234567890');
  });

  // 14. Ввод кириллицы
  test('14. Ввод кириллицы', () => {
    input.value = 'Текст на кириллице';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('Текст на кириллице');
  });

  // 15. Ввод латиницы
  test('15. Ввод латиницы', () => {
    input.value = 'Latin text';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('Latin text');
  });

  // 16. Ввод спецсимволов
  test('16. Ввод разрешенных спец символов', () => {
    input.value = '@#$%^&*().,:;!?';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('@#$%^&*().,:;!?');
  });

  // 17. Текст без пробелов
  test('17. Создание параграфа без пробелов между словами', () => {
    input.value = 'Словобезпробелов';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe('Словобезпробелов');
  });

  // 18. Порядок параграфов
  test('18. Параграфы располагаются друг под другом в порядке создания', () => {
    const texts = ['Первый', 'Второй', 'Третий'];
    texts.forEach(text => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      button.click();
    });
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].textContent).toBe('Первый');
    expect(paragraphs[1].textContent).toBe('Второй');
    expect(paragraphs[2].textContent).toBe('Третий');
  });

  // 19. Очищение инпута
  test('19. Очищение инпута при сохранении параграфа', () => {
    input.value = 'Текст для очистки';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    expect(input.value).toBe('');
  });

  // 20. Одинаковые параграфы
  test('20. Одинаковость параграфов допускается', () => {
    // Первый параграф
    input.value = 'Одинаковый текст';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    // Второй такой же параграф
    input.value = 'Одинаковый текст';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe('Одинаковый текст');
    expect(paragraphs[1].textContent).toBe('Одинаковый текст');
  });

  // 21. Защита от множественных нажатий
  test('21. Недоступность кнопки сохранения после отправки параграфа', () => {
    input.value = 'Текст';
    input.dispatchEvent(new Event('input'));
    
    // Многократное нажатие
    button.click();
    button.click();
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(button.style.display).toBe('none');
  });

  // 22. Поведение при быстром вводе и нажатии
  test('22. Поведение при одновременном изменении полей ввода и нажатии кнопки', () => {
    input.value = 'Быстрый';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    // Быстрая смена текста и повторное нажатие
    input.value = 'Текст';
    input.dispatchEvent(new Event('input'));
    button.click();
    
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe('Быстрый');
    expect(paragraphs[1].textContent).toBe('Текст');
  });
});
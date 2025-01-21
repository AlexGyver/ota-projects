# AlexGyver OTA
Веб-сервис для загрузки скомпилированной прошивки на ESP8266/ESP32, работает на основе [ESP Web Tools](https://esphome.github.io/esp-web-tools/).

Для добавления своему проекту поддержки AlexGyver OTA нужно:
- Создать репозиторий проекта на GitHub
- Создать в корне репозитория в ветке *main* файл *project.json* и оформить его согласно инструкции ниже
- Скомпилировать прошивку, загрузить в репозиторий или в релиз и указать путь к бинарнику в *project.json*

## Файл project.json
Файл содержит информацию о проекте и пути к файлам скомпилированной прошивки для разных платформ в формате, который используется в GyverHub и ESPHome:

```json
{
  "name": "Название проекта",
  "about": "Краткое описание проекта",
  "version": "1.0",
  "notes": "Комментарии к обновлению",
  "builds": [
    {
      "chipFamily": "ESP8266",
      "parts": [
        {
          "path": "https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/firmware.bin",
          "offset": 0
        }
      ]
    }
  ]
}
```

### Массив builds
Если проект может быть запущен на разных ESP-шках - можно приложить отдельный бинарник для каждой и указать пути к ним. Библиотека сама определяет, на какой платформе запущена и выберет нужный файл.

### Параметр chipFamily
Поддерживаемые платформы и значения параметра `chipFamily`:
- `ESP8266`
- `ESP32`
- `ESP32-C3`
- `ESP32-C6`
- `ESP32-S2`
- `ESP32-S3`
- `ESP32-H2`

### Путь path
Путь должен вести к скомпилированному файлу прошивки. Его можно разместить как в самом репозитории, так и в релизах:

#### В репозитории
```
https://raw.githubusercontent.com/<аккаунт>/<проект>/main/<путь от корня репозитория>
```
Примеры:
- bin
  - firmware.bin
  - esp8266
    - firmware.bin
  - esp32
    - firmware.bin
```
https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/firmware.bin
https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/esp8266/firmware.bin
https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/esp32/firmware.bin
```

#### В релизах
```
https://github.com/<аккаунт>/<проект>/releases/latest/download/<файл>
```
Пример:
```
https://github.com/GyverLibs/GyverHub-example/releases/latest/download/firmware.bin
```

### ESP32
Для ESP32 нужны 4 файла: bootloader.bin, partitions.bin, firmware.bin, boot_app0.bin. Первые три генерируются при компиляции, четвёртый лежит локально:

- Arduino IDE: `Arduino15/packages/esp32/hardware/esp32/<version>/tools/partitions/boot_app0.bin`
- PlatformIO: `.platformio/packages/framework-arduinoespressif32/tools/partitions/boot_app0.bin`

Итого для ESP32 нужно указать все 4 файла:

```
"parts": [
  { "path": "bootloader.bin", "offset": 4096 },
  { "path": "partitions.bin", "offset": 32768 },
  { "path": "boot_app0.bin", "offset": 57344 },
  { "path": "firmware.bin", "offset": 65536 }
]
```

Как пример - мой [тестовый репозиторий](https://github.com/GyverLibs/testota). Подробнее можно прочитать [здесь](https://github.com/witnessmenow/ESP-Web-Tools-Tutorial).

## Разработка под несколько платформ
Чтобы определить платформу внутри программы, используем следующие проверки:

```cpp
#if CONFIG_IDF_TARGET_ESP32
// ESP32
#endif

#if CONFIG_IDF_TARGET_ESP32S2
// ESP32-S2
#endif

#if CONFIG_IDF_TARGET_ESP32S3
// ESP32-S3
#endif

#if CONFIG_IDF_TARGET_ESP32C3
// ESP32-C3"
#endif

#if CONFIG_IDF_TARGET_ESP32C6
// ESP32-C6
#endif

#if CONFIG_IDF_TARGET_ESP32H2
// ESP32-H2
#endif

#if defined(ESP8266)
// ESP8266
#endif
```

# AlexGyver OTA
Веб-сервис для загрузки скомпилированной прошивки на ESP8266/ESP32, работает на основе [ESP Web Tools](https://esphome.github.io/esp-web-tools/)

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

<details>
<summary>Полный пример со всем семейством ESP</summary>

```json
{
  "name": "GyverHub-example",
  "about": "Образец оформления репозитория проекта",
  "version": "1.1",
  "notes": "Исправлены мелкие баги",
  "builds": [
    {
      "chipFamily": "ESP8266",
      "parts": [
        {
          "path": "https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/firmware.bin",
          "offset": 0
        }
      ]
    },
    {
      "chipFamily": "ESP32",
      "parts": [
        {
          "path": "https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/firmware.bin",
          "offset": 0
        }
      ]
    },
    {
      "chipFamily": "ESP32-C3",
      "parts": [
        {
          "path": "https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/firmware.bin",
          "offset": 0
        }
      ]
    },
    {
      "chipFamily": "ESP32-S2",
      "parts": [
        {
          "path": "https://raw.githubusercontent.com/GyverLibs/GyverHub-example/main/bin/firmware.bin",
          "offset": 0
        }
      ]
    },
    {
      "chipFamily": "ESP32-S3",
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
</details>

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
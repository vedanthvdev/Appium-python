Pod::Spec.new do |s|
  s.name           = 'WidgetBridge'
  s.version        = '1.0.0'
  s.summary        = 'Daily Vocab widget bridge (App Group + reload)'
  s.description    = 'Shared storage and WidgetKit reload for Daily Vocab'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  # Widget extension sources live in WidgetExtension/ and must not compile into the app module.
  s.source_files = "WidgetBridgeModule.swift"
  s.frameworks = 'WidgetKit'
end

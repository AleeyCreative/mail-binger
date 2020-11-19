import pixellib
from pixellib.tune_bg import alter_bg

effects_obj = alter_bg(model_type='pb')
effects_obj.load_pascalvoc_model('xception_pascalvoc.pb')
effects_obj.blur_bg("bedroom.png", extreme=True, output_image_name="outty.jpg")
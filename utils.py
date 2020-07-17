from ml_model import Dataset, PricePredictionModel
from models import db, Query


def load_model(city_code):
    # check database, if not found make api call

    print("loding model ***********************************")
    model = Query.query.filter_by(city_code=city_code).first()

    if not model:
        print("api call ***********************************")
        dataset = Dataset(city_code)
        model = PricePredictionModel(dataset)

        model = Query(city_code=model.city_code, model=model)

        db.session.add(model)
        db.session.commit()

    print("model loaded ***********************************")
    return model

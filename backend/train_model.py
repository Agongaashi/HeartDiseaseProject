import os
import pickle
import sys

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC


FEATURE_COLUMNS = ["age", "sex", "blood_pressure", "cholesterol", "heart_rate"]
TARGET_COLUMN = "target"
DATASET_PATH = "dataset/heart.csv"
MODEL_PATH = "models/ml_model.pkl"


def load_dataset():
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        print(f"Current folder: {os.getcwd()}")
        sys.exit(1)

    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"Columns: {list(df.columns)}")

    missing_columns = [col for col in FEATURE_COLUMNS + [TARGET_COLUMN] if col not in df.columns]
    if missing_columns:
        print(f"Missing columns: {missing_columns}")
        sys.exit(1)

    return df


def build_models():
    return {
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("model", LogisticRegression(max_iter=1000, random_state=42))
        ]),
        "Random Forest": RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            random_state=42
        ),
        "SVM": Pipeline([
            ("scaler", StandardScaler()),
            ("model", SVC(kernel="rbf", probability=True, random_state=42))
        ])
    }


def train_model():
    df = load_dataset()

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nDataset split:")
    print(f"  Training rows: {X_train.shape[0]}")
    print(f"  Test rows: {X_test.shape[0]}")

    models = build_models()
    results = []

    print("\nTraining models...")
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        metrics = {
            "name": name,
            "model": model,
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred, zero_division=0),
            "recall": recall_score(y_test, y_pred, zero_division=0),
            "f1": f1_score(y_test, y_pred, zero_division=0)
        }
        results.append(metrics)

        print(
            f"  {name}: "
            f"accuracy={metrics['accuracy']:.3f}, "
            f"precision={metrics['precision']:.3f}, "
            f"recall={metrics['recall']:.3f}, "
            f"f1={metrics['f1']:.3f}"
        )

    best = max(results, key=lambda item: (item["f1"], item["recall"], item["accuracy"]))

    print(f"\nBest model: {best['name']}")
    print(
        f"Selected by highest F1 score "
        f"(F1={best['f1']:.3f}, Recall={best['recall']:.3f}, Accuracy={best['accuracy']:.3f})"
    )

    best_predictions = best["model"].predict(X_test)
    print("\nClassification report for best model:")
    print(classification_report(y_test, best_predictions, zero_division=0))

    os.makedirs("models", exist_ok=True)
    with open(MODEL_PATH, "wb") as file:
        pickle.dump(best["model"], file)

    print(f"Model saved at: {MODEL_PATH}")
    print("\nComparison table for diploma:")
    print("Model,Accuracy,Precision,Recall,F1")
    for result in results:
        print(
            f"{result['name']},"
            f"{result['accuracy']:.3f},"
            f"{result['precision']:.3f},"
            f"{result['recall']:.3f},"
            f"{result['f1']:.3f}"
        )


if __name__ == "__main__":
    train_model()

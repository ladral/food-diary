import unittest
from datetime import date
from unittest.mock import patch, MagicMock
from correlations.service import gather_intakes, gather_occurrences, calculate_phi, calculate_correlations

class TestCorrelationsService(unittest.TestCase):

    @patch('correlations.service.Intake.objects.filter')
    def test_gather_intakes(self, mock_filter):
        # arrange
        mock_intake_1 = MagicMock(food_id=MagicMock(id=1), date=date(2025, 5, 25), user_id=1)
        mock_intake_2 = MagicMock(food_id=MagicMock(id=2), date=date(2025, 5, 26), user_id=1)

        mock_queryset = MagicMock()
        mock_queryset.exclude.return_value = mock_queryset
        mock_queryset.select_related.return_value = [mock_intake_1, mock_intake_2]

        mock_filter.return_value = mock_queryset

        user = MagicMock(id=1)
        ignored_food_ids = [2]

        # act
        result = gather_intakes(user, ignored_food_ids)

        # assert
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0].food_id.id, 1)
        self.assertEqual(result[1].food_id.id, 2)

        mock_queryset.exclude.assert_called_once_with(food_id__in=ignored_food_ids)

        mock_queryset.select_related.assert_called_once_with('food_id')


    @patch('correlations.service.Occurrence.objects.filter')
    def test_gather_occurrences(self, mock_filter):
        # arrange
        mock_occurrence_1 = MagicMock(symptom_id=MagicMock(id=100), date=date(2025, 5, 25), user_id=1)
        mock_occurrence_2 = MagicMock(symptom_id=MagicMock(id=101), date=date(2025, 5, 26), user_id=1)

        mock_queryset = MagicMock()
        mock_queryset.exclude.return_value = mock_queryset
        mock_queryset.select_related.return_value = [mock_occurrence_1, mock_occurrence_2]

        mock_filter.return_value = mock_queryset

        user = MagicMock(id=1)

        # act
        result = gather_occurrences(user)

        # assert
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0].symptom_id.id, 100)

    def test_calculate_phi(self):
        test_cases = [
            ([1, 1, 1, 1], 0),
            ([10, 0, 0, 10], 1),
            ([10, 0, 10, 0], -1),
            ([0, 0, 0, 0], 0),
        ]

        for table, expected in test_cases:
            result = calculate_phi(table)
            self.assertAlmostEqual(result, expected,
                msg=f"Failed for input {table}. Expected {expected}, got {result}")


    def test_calculate_correlations_should_contain_all_entries(self):
        # arrange
        food_1_id = 1
        food_2_id = 2

        symptom_1_id = 101
        symptom_2_id = 102

        mock_intake_1 = MagicMock(food_id=MagicMock(id=food_1_id), date=date(2025, 5, 25))
        mock_intake_2 = MagicMock(food_id=MagicMock(id=food_2_id), date=date(2025, 5, 26))
        intakes = [mock_intake_1, mock_intake_2]

        mock_occurrence_1 = MagicMock(symptom_id=MagicMock(id=symptom_1_id), date=date(2025, 5, 26))
        mock_occurrence_2 = MagicMock(symptom_id=MagicMock(id=symptom_2_id), date=date(2025, 5, 27))
        occurrences = [mock_occurrence_1, mock_occurrence_2]

        # act
        result = calculate_correlations(intakes, occurrences)

        # assert
        self.assertIn(symptom_1_id, result)
        self.assertIn(symptom_2_id, result)
        self.assertIn(food_1_id, result[symptom_1_id])
        self.assertIn(food_1_id, result[symptom_1_id])
        self.assertIn(food_1_id, result[symptom_2_id])
        self.assertIn(food_1_id, result[symptom_2_id])


    def test_calculate_correlations_should_return_expected_correlation_coefficient(self):
        # arrange
        symptom_id = 101

        food_1_id = 1
        food_2_id = 2
        expected_food_1_correlation_coefficient = 0.5
        expected_food_2_correlation_coefficient = -1

        mock_intake_1 = MagicMock(food_id=MagicMock(id=food_1_id), date=date(2025, 5, 24))
        mock_intake_2 = MagicMock(food_id=MagicMock(id=food_1_id), date=date(2025, 5, 25))
        mock_intake_3 = MagicMock(food_id=MagicMock(id=food_2_id), date=date(2025, 5, 26))
        intakes = [mock_intake_1, mock_intake_2, mock_intake_3]

        mock_occurrence_1 = MagicMock(symptom_id=MagicMock(id=symptom_id), date=date(2025, 5, 26))
        occurrences = [mock_occurrence_1]

        # act
        result = calculate_correlations(intakes, occurrences)

        # assert
        self.assertEqual(expected_food_1_correlation_coefficient, result[symptom_id][food_1_id]['correlation_coefficient'])
        self.assertEqual(expected_food_2_correlation_coefficient, result[symptom_id][food_2_id]['correlation_coefficient'])


if __name__ == '__main__':
    unittest.main()

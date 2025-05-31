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

    @patch('correlations.service.Intake.objects.filter')
    @patch('correlations.service.Occurrence.objects.filter')
    def test_calculate_correlations(self, mock_occurrence_filter, mock_intake_filter):
        # arrange
        mock_food_a = MagicMock(id=1, name='Food A')
        mock_food_b = MagicMock(id=2, name='Food B')
        mock_intake_1 = MagicMock(food_id=mock_food_a, date=date(2025, 5, 25))
        mock_intake_2 = MagicMock(food_id=mock_food_b, date=date(2025, 5, 26))

        mock_intake_queryset = MagicMock()
        mock_intake_queryset.exclude.return_value = mock_intake_queryset
        mock_intake_queryset.select_related.return_value = [mock_intake_1, mock_intake_2]

        mock_intake_filter.return_value = mock_intake_queryset

        mock_symptom_x = MagicMock(id=100, name='Symptom X')
        mock_symptom_y = MagicMock(id=101, name='Symptom Y')
        mock_occurrence_1 = MagicMock(symptom_id=mock_symptom_x, date=date(2025, 5, 25))
        mock_occurrence_2 = MagicMock(symptom_id=mock_symptom_y, date=date(2025, 5, 26))
        mock_occurrence_queryset = MagicMock()
        mock_occurrence_queryset.exclude.return_value = mock_occurrence_queryset
        mock_occurrence_queryset.select_related.return_value = [mock_occurrence_1, mock_occurrence_2]

        mock_occurrence_filter.select_related.return_value = mock_occurrence_queryset


        intakes = [mock_intake_1, mock_intake_2]
        occurrences = [mock_occurrence_1, mock_occurrence_2]

        # act
        result = calculate_correlations(intakes, occurrences)

        # assert
        self.assertIn(100, result)
        self.assertIn(1, result[100])
        self.assertIn(2, result[100])

if __name__ == '__main__':
    unittest.main()
